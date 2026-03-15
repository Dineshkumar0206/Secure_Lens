package com.securelens.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securelens.dto.Dtos;
import com.securelens.model.Scan;
import com.securelens.model.User;
import com.securelens.repository.ScanRepository;
import com.securelens.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ScanService - Orchestrates URL scanning and scan history retrieval.
 * Coordinates between UrlAnalysisService (detection) and ScanRepository (persistence).
 */
@Service
public class ScanService {

    @Autowired
    private UrlAnalysisService urlAnalysisService;

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Analyze a URL and persist the result to the database.
     */
    @Transactional
    public Dtos.ScanResponse scanUrl(String url, String username) {
        // Perform the actual threat analysis
        Dtos.ScanResponse analysisResult = urlAnalysisService.analyzeUrl(url);

        // Load the requesting user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Save the scan result to the database
        Scan scan = new Scan();
        scan.setUrl(url);
        scan.setThreatLevel(analysisResult.getThreatLevel());
        scan.setThreatScore(analysisResult.getThreatScore());
        scan.setRiskPercentage(analysisResult.getRiskPercentage());
        scan.setUser(user);

        // Serialize the flags list to a JSON string for storage
        try {
            scan.setFlags(objectMapper.writeValueAsString(analysisResult.getFlags()));
        } catch (JsonProcessingException e) {
            scan.setFlags("[]");
        }

        Scan savedScan = scanRepository.save(scan);
        analysisResult.setId(savedScan.getId());
        analysisResult.setScannedAt(savedScan.getScannedAt());

        return analysisResult;
    }

    /**
     * Get full scan history for a user.
     */
    public List<Dtos.ScanResponse> getScanHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return scanRepository.findByUserOrderByScannedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get dashboard statistics for a user.
     */
    public Dtos.DashboardStats getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Dtos.DashboardStats stats = new Dtos.DashboardStats();
        stats.setTotalScans(scanRepository.countByUser(user));
        stats.setSafeLinks(scanRepository.countByUserAndThreatLevel(user, "SAFE"));
        stats.setSuspiciousLinks(scanRepository.countByUserAndThreatLevel(user, "SUSPICIOUS"));
        stats.setPhishingDetected(scanRepository.countByUserAndThreatLevel(user, "PHISHING"));

        return stats;
    }

    /**
     * Map a Scan entity to a ScanResponse DTO.
     * Deserializes the stored flags JSON back to a list.
     */
    private Dtos.ScanResponse mapToResponse(Scan scan) {
        Dtos.ScanResponse response = new Dtos.ScanResponse();
        response.setId(scan.getId());
        response.setUrl(scan.getUrl());
        response.setThreatLevel(scan.getThreatLevel());
        response.setThreatScore(scan.getThreatScore());
        response.setRiskPercentage(scan.getRiskPercentage());
        response.setScannedAt(scan.getScannedAt());

        // Deserialize flags from JSON string
        try {
            List<String> flags = objectMapper.readValue(
                    scan.getFlags() != null ? scan.getFlags() : "[]",
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
            );
            response.setFlags(flags);
        } catch (Exception e) {
            response.setFlags(List.of());
        }

        return response;
    }
}
