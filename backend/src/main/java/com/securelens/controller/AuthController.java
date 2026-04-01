package com.securelens.controller;

import com.securelens.dto.Dtos;
import com.securelens.model.User;
import com.securelens.repository.UserRepository;
import com.securelens.security.JwtUtils;
import com.securelens.service.GoogleTokenVerifier;
import com.securelens.service.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

/**
 * AuthController - Handles user registration and login.
 *
 * POST /api/auth/register  → Create a new user account
 * POST /api/auth/login     → Authenticate and return JWT token
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    @Autowired
    private EmailService emailService;

    @Value("${app.reset-token-hours:1}")
    private long resetTokenHours;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    /**
     * POST /api/auth/register
     * Registers a new user. Validates uniqueness of username and email.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody Dtos.RegisterRequest registerRequest) {

        // Check if username is already taken
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new Dtos.ApiResponse(false, "Username is already taken!"));
        }

        // Check if email is already registered
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new Dtos.ApiResponse(false, "Email is already in use!"));
        }

        // Create new user — hash password with BCrypt before saving
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(new Dtos.ApiResponse(true, "User registered successfully!"));
    }

    /**
     * POST /api/auth/login
     * Authenticates user credentials and returns a signed JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody Dtos.LoginRequest loginRequest) {

        // Authenticate credentials via Spring Security
        Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
                resolveUsername(loginRequest.getIdentifier()),
                loginRequest.getPassword()
        )
        );

        // Set authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Load user details for the response
        User user = userRepository.findByUsername(resolveUsername(loginRequest.getIdentifier()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update last login timestamp
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(new Dtos.AuthResponse(jwt, user.getId(),
                user.getUsername(), user.getEmail()));
    }

    /**
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody Dtos.ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiration(LocalDateTime.now().plusHours(resetTokenHours));
            userRepository.save(user);
            emailService.sendPasswordReset(user, token);
            logger.info("Password reset token for {}: {}", user.getEmail(), token);
        });

        return ResponseEntity.ok(new Dtos.ApiResponse(true,
                "If an account with that email exists, we sent password reset instructions."));
    }

    /**
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody Dtos.ResetPasswordRequest request) {
        return userRepository.findByResetToken(request.getToken())
                .map(user -> {
                    if (user.getResetTokenExpiration() == null ||
                            user.getResetTokenExpiration().isBefore(LocalDateTime.now())) {
                        return ResponseEntity.badRequest()
                                .body(new Dtos.ApiResponse(false, "Reset token has expired"));
                    }

                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    user.setResetToken(null);
                    user.setResetTokenExpiration(null);
                    userRepository.save(user);
                    return ResponseEntity.ok(new Dtos.ApiResponse(true, "Password reset successfully"));
                })
                .orElseGet(() ->
                        ResponseEntity.badRequest()
                                .body(new Dtos.ApiResponse(false, "Invalid reset token")));
    }

    private String resolveUsername(String identifier) {
        if (identifier.contains("@")) {
            return userRepository.findByEmail(identifier)
                    .map(User::getUsername)
                    .orElse(identifier);
        }
        return identifier;
    }

    /**
     * POST /api/auth/google
     * Accepts an ID token produced by Google's OAuth flow and
     * returns a JWT for the SecureLens backend.
     */
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@Valid @RequestBody Dtos.GoogleLoginRequest request) {
        GoogleTokenVerifier.GoogleProfile profile = googleTokenVerifier.verify(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid Google ID token"));

        String email = profile.email();
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Google profile missing email");
        }
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUserFromGoogle(profile));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());
        return ResponseEntity.ok(new Dtos.AuthResponse(jwt, user.getId(),
                user.getUsername(), user.getEmail()));
    }

    private User createUserFromGoogle(GoogleTokenVerifier.GoogleProfile profile) {
        User user = new User();
        user.setEmail(profile.email());
        user.setUsername(buildUsernameFromGoogle(profile));
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        return user;
    }

    private String buildUsernameFromGoogle(GoogleTokenVerifier.GoogleProfile profile) {
        String candidateBase = profile.name() != null ? profile.name().trim() : "";
        if (candidateBase.isBlank()) {
            candidateBase = profile.email().split("@")[0];
        }
        candidateBase = candidateBase.replaceAll("[^a-zA-Z0-9]", "").toLowerCase(Locale.ROOT);
        if (candidateBase.length() < 3) {
            candidateBase = candidateBase + "user";
        }

        String candidate = candidateBase;
        int suffix = 0;
        while (userRepository.existsByUsername(candidate)) {
            suffix++;
            candidate = candidateBase + suffix;
        }
        return candidate;
    }
}
