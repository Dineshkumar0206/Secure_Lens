package com.securelens.controller;

import com.securelens.dto.Dtos;
import com.securelens.service.ScanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ScanController - REST API for URL scanning and scan history.
 *
 * POST /api/scan/url      → Analyze a URL for threats
 * GET  /api/scan/history  → Get current user's scan history
 * GET  /api/scan/stats    → Get dashboard stats for current user
 */
@RestController
@RequestMapping("/api/scan")
public class ScanController {

    @Autowired
    private ScanService scanService;

    /**
     * POST /api/scan/url
     * Analyze a URL and return a threat assessment.
     * Requires valid JWT token in Authorization header.
     */
    @PostMapping("/url")
    public ResponseEntity<Dtos.ScanResponse> scanUrl(
            @Valid @RequestBody Dtos.ScanRequest scanRequest,
            Authentication authentication) {

        // Get the currently authenticated username from JWT context
        String username = authentication.getName();

        Dtos.ScanResponse result = scanService.scanUrl(scanRequest.getUrl(), username);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/scan/history
     * Returns all scans performed by the authenticated user.
     */
    @GetMapping("/history")
    public ResponseEntity<List<Dtos.ScanResponse>> getScanHistory(Authentication authentication) {
        String username = authentication.getName();
        List<Dtos.ScanResponse> history = scanService.getScanHistory(username);
        return ResponseEntity.ok(history);
    }

    /**
     * GET /api/scan/stats
     * Returns dashboard statistics for the authenticated user.
     */
    @GetMapping("/stats")
    public ResponseEntity<Dtos.DashboardStats> getDashboardStats(Authentication authentication) {
        String username = authentication.getName();
        Dtos.DashboardStats stats = scanService.getDashboardStats(username);
        return ResponseEntity.ok(stats);
    }
}
