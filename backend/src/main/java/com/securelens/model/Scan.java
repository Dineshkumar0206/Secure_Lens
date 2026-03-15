package com.securelens.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scan entity - stores the result of each URL threat analysis.
 * Maps to the `scans` table in MySQL.
 */
@Entity
@Table(name = "scans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url", nullable = false, length = 2048)
    private String url;

    /**
     * Threat level: SAFE | SUSPICIOUS | PHISHING
     */
    @Column(name = "threat_level", nullable = false)
    private String threatLevel;

    /**
     * Numeric threat score from 0 (safe) to 100 (definitely phishing)
     */
    @Column(name = "threat_score", nullable = false)
    private int threatScore;

    /**
     * Human-readable risk percentage string, e.g. "75%"
     */
    @Column(name = "risk_percentage")
    private String riskPercentage;

    /**
     * JSON-serialized list of flags triggered during analysis
     * e.g. ["No HTTPS", "IP-based URL", "Suspicious keyword: secure-login"]
     */
    @Column(name = "flags", length = 2048)
    private String flags;

    @Column(name = "scanned_at", nullable = false, updatable = false)
    private LocalDateTime scannedAt;

    // Many scans belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.scannedAt = LocalDateTime.now();
    }
}
