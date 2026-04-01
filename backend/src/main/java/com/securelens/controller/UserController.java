package com.securelens.controller;

import com.securelens.dto.Dtos;
import com.securelens.model.User;
import com.securelens.repository.ScanRepository;
import com.securelens.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * UserController - REST API for user profile information.
 *
 * GET /api/user/profile → Get current user's profile
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * GET /api/user/profile
     * Returns profile info for the authenticated user.
     */
    @GetMapping("/profile")
    public ResponseEntity<Dtos.UserProfile> getUserProfile(Authentication authentication) {
        User user = findAuthUser(authentication);

        return ResponseEntity.ok(buildProfile(user));
    }

    /**
     * GET /api/user/account-settings
     * Surface security and scanning health data for the authenticated user.
     */
    @GetMapping("/account-settings")
    public ResponseEntity<Dtos.AccountSettings> getAccountSettings(Authentication authentication) {
        User user = findAuthUser(authentication);
        return ResponseEntity.ok(buildAccountSettings(user));
    }

    /**
     * PUT /api/user/profile
     * Allows users to update their username and email.
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody Dtos.ProfileUpdateRequest request,
                                               Authentication authentication) {
        User user = findAuthUser(authentication);

        String trimmedUsername = request.getUsername().trim();
        String trimmedEmail = request.getEmail().trim();

        if (!trimmedUsername.equals(user.getUsername()) &&
                userRepository.existsByUsername(trimmedUsername)) {
            return ResponseEntity.badRequest()
                    .body(new Dtos.ApiResponse(false, "Username is already taken"));
        }

        if (!trimmedEmail.equals(user.getEmail()) &&
                userRepository.existsByEmail(trimmedEmail)) {
            return ResponseEntity.badRequest()
                    .body(new Dtos.ApiResponse(false, "Email is already in use"));
        }

        user.setUsername(trimmedUsername);
        user.setEmail(trimmedEmail);
        userRepository.save(user);

        return ResponseEntity.ok(buildProfile(user));
    }

    /**
     * POST /api/user/change-password
     * Allows the authenticated user to update their password.
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody Dtos.PasswordChangeRequest request,
                                            Authentication authentication) {
        User user = findAuthUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new Dtos.ApiResponse(false, "Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new Dtos.ApiResponse(true, "Password changed successfully"));
    }

    /**
     * DELETE /api/user/account
     * Deletes the authenticated user after password confirmation.
     */
    @PostMapping("/account/delete")
    @Transactional
    public ResponseEntity<?> deleteAccount(@Valid @RequestBody Dtos.DeleteAccountRequest request,
                                           Authentication authentication) {
        User user = findAuthUser(authentication);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new Dtos.ApiResponse(false, "Password is incorrect"));
        }

        scanRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
        return ResponseEntity.ok(new Dtos.ApiResponse(true, "Account deleted successfully"));
    }

    private Dtos.UserProfile buildProfile(User user) {
        Dtos.UserProfile profile = new Dtos.UserProfile();
        profile.setId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setCreatedAt(user.getCreatedAt());
        profile.setLastLogin(user.getLastLogin());
        profile.setTotalScans(scanRepository.countByUser(user));
        return profile;
    }

    private Dtos.AccountSettings buildAccountSettings(User user) {
        Dtos.AccountSettings accountSettings = new Dtos.AccountSettings();
        long safeScans = scanRepository.countByUserAndThreatLevel(user, "SAFE");
        long suspiciousScans = scanRepository.countByUserAndThreatLevel(user, "SUSPICIOUS");
        long phishingScans = scanRepository.countByUserAndThreatLevel(user, "PHISHING");
        long totalScans = safeScans + suspiciousScans + phishingScans;

        LocalDateTime now = LocalDateTime.now();
        int accountAgeDays = (int) Math.max(0, Duration.between(user.getCreatedAt(), now).toDays());
        long daysSinceLastLogin = user.getLastLogin() != null
                ? Math.max(0, Duration.between(user.getLastLogin(), now).toDays())
                : accountAgeDays;

        accountSettings.setId(user.getId());
        accountSettings.setUsername(user.getUsername());
        accountSettings.setEmail(user.getEmail());
        accountSettings.setCreatedAt(user.getCreatedAt());
        accountSettings.setLastLogin(user.getLastLogin());
        accountSettings.setAccountAgeDays(accountAgeDays);
        accountSettings.setDaysSinceLastLogin(daysSinceLastLogin);
        accountSettings.setSafeScans(safeScans);
        accountSettings.setSuspiciousScans(suspiciousScans);
        accountSettings.setPhishingScans(phishingScans);
        accountSettings.setTotalScans(totalScans);
        accountSettings.setSecurityStatus(determineSecurityStatus(daysSinceLastLogin));
        accountSettings.setSecuritySummary(createSecuritySummary(safeScans, suspiciousScans, phishingScans));
        accountSettings.setRecommendedAction(createRecommendedAction(daysSinceLastLogin, totalScans));
        return accountSettings;
    }

    private String determineSecurityStatus(long daysSinceLastLogin) {
        if (daysSinceLastLogin <= 3) {
            return "Actively scanning";
        } else if (daysSinceLastLogin <= 14) {
            return "Monitoring";
        }
        return "Idle – needs attention";
    }

    private String createSecuritySummary(long safeScans, long suspiciousScans, long phishingScans) {
        if (safeScans == 0 && suspiciousScans == 0 && phishingScans == 0) {
            return "No scans yet, start with a baseline audit.";
        }
        long total = safeScans + suspiciousScans + phishingScans;
        double safeRatio = total == 0 ? 0 : (double) safeScans / total;
        if (safeRatio >= 0.75) {
            return "High confidence posture; keep scanning regularly.";
        }
        if (suspiciousScans + phishingScans > safeScans / 2.0) {
            return "Investigate the recent suspicious findings; rotate credentials if unsure.";
        }
        return "Healthy with a few warnings; keep watch on suspicious detections.";
    }

    private String createRecommendedAction(long daysSinceLastLogin, long totalScans) {
        if (daysSinceLastLogin > 30) {
            return "Revisit your SecureLens dashboard and confirm credentials.";
        }
        if (totalScans == 0) {
            return "Launch the first scan to establish a baseline.";
        }
        return "Schedule a recurring scan and consider a password rotation.";
    }

    private User findAuthUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
