package com.securelens.controller;

import com.securelens.dto.Dtos;
import com.securelens.model.User;
import com.securelens.repository.ScanRepository;
import com.securelens.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    /**
     * GET /api/user/profile
     * Returns profile info for the authenticated user.
     */
    @GetMapping("/profile")
    public ResponseEntity<Dtos.UserProfile> getUserProfile(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dtos.UserProfile profile = new Dtos.UserProfile();
        profile.setId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setCreatedAt(user.getCreatedAt());
        profile.setLastLogin(user.getLastLogin());
        profile.setTotalScans(scanRepository.countByUser(user));

        return ResponseEntity.ok(profile);
    }
}
