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
     * Payload for POST /api/auth/google
     */
    @Data
    public static class GoogleLoginRequest {
        @NotBlank(message = "Token is required")
        private String token;
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
     * Payload for updating a profile
     */
    @Data
    public static class ProfileUpdateRequest {
        @NotBlank(message = "Display name is required")
        @Size(min = 3, max = 50, message = "Display name must be 3–50 characters")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
    }

    /**
     * Payload used when an authenticated user requests a password change.
     */
    @Data
    public static class PasswordChangeRequest {
        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "New password must be at least 8 characters")
        private String newPassword;
    }

    /**
     * Request used when a user wants to delete their account.
     */
    @Data
    public static class DeleteAccountRequest {
        @NotBlank(message = "Password is required to delete the account")
        private String password;
    }

    /**
     * Account settings summary shown alongside profile data.
     */
    @Data
    public static class AccountSettings {
        private Long id;
        private String username;
        private String email;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
        private int accountAgeDays;
        private long daysSinceLastLogin;
        private long totalScans;
        private long safeScans;
        private long suspiciousScans;
        private long phishingScans;
        private String securityStatus;
        private String securitySummary;
        private String recommendedAction;
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
