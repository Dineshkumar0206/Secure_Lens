package com.securelens.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO classes for request/response payloads.
 * Keeps the API layer decoupled from entity layer.
 */
public class Dtos {

    // ─── Auth DTOs ───────────────────────────────────────────────────────────

    /**
     * Payload for POST /api/auth/register
     */
    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be 3–50 characters")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;
    }

    /**
     * Payload for POST /api/auth/login
     */
    @Data
    public static class LoginRequest {
        @NotBlank(message = "Username or email is required")
        private String identifier;

        @NotBlank(message = "Password is required")
        private String password;
    }

    /**
     * Payload to request a password reset token.
     */
    @Data
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
    }

    /**
     * Payload to reset a password using a token.
     */
    @Data
    public static class ResetPasswordRequest {
        @NotBlank(message = "Token is required")
        private String token;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;
    }

    /**
     * Response returned after successful login
     */
    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;

        public AuthResponse(String token, Long id, String username, String email) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }

    // ─── Scan DTOs ───────────────────────────────────────────────────────────

    /**
     * Payload for POST /api/scan/url
     */
    @Data
    public static class ScanRequest {
        @NotBlank(message = "URL is required")
        private String url;
    }

    /**
     * Full scan analysis result returned to the frontend
     */
    @Data
    public static class ScanResponse {
        private Long id;
        private String url;
        private String threatLevel;   // SAFE | SUSPICIOUS | PHISHING
        private int threatScore;      // 0–100
        private String riskPercentage;
        private List<String> flags;   // Detected issues
        private LocalDateTime scannedAt;

        // Security header analysis
        private boolean hasHttps;
        private boolean hasSuspiciousKeywords;
        private boolean isIpBased;
        private boolean isLongUrl;
        private boolean hasDomainMismatch;
    }

    /**
     * Dashboard statistics for the current user
     */
    @Data
    public static class DashboardStats {
        private long totalScans;
        private long safeLinks;
        private long suspiciousLinks;
        private long phishingDetected;
    }

    /**
     * User profile info
     */
    @Data
    public static class UserProfile {
        private Long id;
        private String username;
        private String email;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
        private long totalScans;
    }

    /**
     * Generic API response wrapper
     */
    @Data
    public static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
