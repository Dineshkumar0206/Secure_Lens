package com.securelens.service;

import com.securelens.dto.Dtos;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * UrlAnalysisService - Core phishing detection engine.
 *
 * Analyzes a URL using multiple heuristics:
 *  1. HTTPS check
 *  2. Suspicious keyword detection
 *  3. IP-based URL detection
 *  4. Long URL detection
 *  5. Domain mismatch / subdomain abuse
 *  6. Special character abuse
 *  7. TLD suspicion scoring
 *
 * Produces a threat score (0–100) and classifies as:
 *   SAFE (0–30), SUSPICIOUS (31–65), PHISHING (66–100)
 */
@Service
public class UrlAnalysisService {

    // ─── Suspicious keyword patterns commonly found in phishing URLs ───────
    private static final List<String> SUSPICIOUS_KEYWORDS = List.of(
            "login", "signin", "verify", "secure", "account", "update",
            "banking", "paypal", "amazon", "apple", "microsoft", "google",
            "ebay", "netflix", "support", "confirm", "password", "credential",
            "wallet", "recover", "suspended", "limited", "unlock", "alert",
            "urgent", "verify-now", "click-here", "free", "winner", "prize"
    );

    // ─── Suspicious TLDs (top-level domains) ───────────────────────────────
    private static final List<String> SUSPICIOUS_TLDS = List.of(
            ".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".pw",
            ".top", ".club", ".online", ".site", ".click", ".link"
    );

    // ─── Regex: matches bare IP address in URL ──────────────────────────────
    private static final Pattern IP_PATTERN = Pattern.compile(
            "https?://(\\d{1,3}\\.){3}\\d{1,3}(:\\d+)?(/.*)?");

    // ─── Regex: detects encoded characters used to obfuscate ───────────────
    private static final Pattern HEX_PATTERN = Pattern.compile("%[0-9a-fA-F]{2}");

    // ─── Regex: @-symbol trick (e.g., http://paypal.com@evil.com) ──────────
    private static final Pattern AT_SYMBOL_PATTERN = Pattern.compile("https?://[^@]+@");

    /**
     * Analyze a URL and return a full ScanResponse with threat assessment.
     */
    public Dtos.ScanResponse analyzeUrl(String url) {
        Dtos.ScanResponse result = new Dtos.ScanResponse();
        List<String> flags = new ArrayList<>();
        int score = 0;

        result.setUrl(url);

        // ── 1. HTTPS Check ─────────────────────────────────────────────────
        boolean hasHttps = url.toLowerCase().startsWith("https://");
        result.setHasHttps(hasHttps);
        if (!hasHttps) {
            flags.add("⚠ No HTTPS — connection is not encrypted");
            score += 20;
        }

        // ── 2. IP-based URL Detection ──────────────────────────────────────
        boolean isIpBased = IP_PATTERN.matcher(url).matches();
        result.setIpBased(isIpBased);
        if (isIpBased) {
            flags.add("🔴 IP-based URL detected — no domain name used");
            score += 30;
        }

        // ── 3. Long URL Detection (>75 chars is suspicious) ────────────────
        boolean isLongUrl = url.length() > 75;
        result.setLongUrl(isLongUrl);
        if (isLongUrl) {
            flags.add("⚠ Unusually long URL (" + url.length() + " characters)");
            score += 10;
        }

        // ── 4. Suspicious Keyword Detection ───────────────────────────────
        boolean foundKeyword = false;
        String urlLower = url.toLowerCase();
        for (String keyword : SUSPICIOUS_KEYWORDS) {
            if (urlLower.contains(keyword)) {
                flags.add("⚠ Suspicious keyword found: \"" + keyword + "\"");
                score += 8;
                foundKeyword = true;
            }
        }
        result.setHasSuspiciousKeywords(foundKeyword);

        // ── 5. Suspicious TLD Detection ────────────────────────────────────
        for (String tld : SUSPICIOUS_TLDS) {
            if (urlLower.contains(tld)) {
                flags.add("🔴 Suspicious TLD detected: \"" + tld + "\"");
                score += 15;
                break;
            }
        }

        // ── 6. @ Symbol in URL (obfuscation trick) ─────────────────────────
        if (AT_SYMBOL_PATTERN.matcher(url).find()) {
            flags.add("🔴 @ symbol in URL — possible redirect obfuscation");
            score += 25;
        }

        // ── 7. Hex Encoding (URL obfuscation) ─────────────────────────────
        if (HEX_PATTERN.matcher(url).find()) {
            flags.add("⚠ Hex-encoded characters detected in URL");
            score += 12;
        }

        // ── 8. Multiple Subdomains (subdomain spoofing) ────────────────────
        try {
            URI uri = new URI(url.startsWith("http") ? url : "http://" + url);
            String host = uri.getHost();
            if (host != null) {
                long dotCount = host.chars().filter(c -> c == '.').count();
                if (dotCount >= 3) {
                    flags.add("⚠ Excessive subdomains detected (" + dotCount + " dots in host)");
                    score += 15;
                }

                // ── 9. Domain Mismatch Detection ──────────────────────────
                boolean mismatch = checkDomainMismatch(host, url);
                result.setHasDomainMismatch(mismatch);
                if (mismatch) {
                    flags.add("🔴 Domain mismatch — trusted brand name in subdomain");
                    score += 25;
                }
            }
        } catch (Exception e) {
            flags.add("⚠ Malformed URL structure");
            score += 10;
        }

        // ── 10. Double Slashes in Path (obfuscation) ───────────────────────
        if (url.contains("//") && url.indexOf("//") != url.indexOf("://")) {
            flags.add("⚠ Double slashes detected in URL path");
            score += 8;
        }

        // ─── Cap score at 100 ──────────────────────────────────────────────
        score = Math.min(score, 100);

        // ─── Classify threat level ─────────────────────────────────────────
        String threatLevel;
        if (score <= 30) {
            threatLevel = "SAFE";
        } else if (score <= 65) {
            threatLevel = "SUSPICIOUS";
        } else {
            threatLevel = "PHISHING";
        }

        // ─── If no flags, it's clean ───────────────────────────────────────
        if (flags.isEmpty()) {
            flags.add("✅ No threats detected — URL appears legitimate");
        }

        result.setThreatScore(score);
        result.setThreatLevel(threatLevel);
        result.setRiskPercentage(score + "%");
        result.setFlags(flags);

        return result;
    }

    /**
     * Checks if a well-known brand name appears as a subdomain of a different domain.
     * E.g., paypal.com.evil.com — "paypal" is a subdomain, not the real domain.
     */
    private boolean checkDomainMismatch(String host, String url) {
        List<String> trustedBrands = List.of(
                "paypal", "amazon", "apple", "microsoft", "google",
                "facebook", "instagram", "netflix", "ebay", "dropbox",
                "linkedin", "twitter", "chase", "bankofamerica"
        );

        if (host == null) return false;

        String[] parts = host.split("\\.");
        // If the brand name appears in a subdomain (not the main domain)
        if (parts.length >= 3) {
            for (int i = 0; i < parts.length - 2; i++) {
                for (String brand : trustedBrands) {
                    if (parts[i].equalsIgnoreCase(brand)) {
                        return true; // Brand in subdomain = mismatch
                    }
                }
            }
        }
        return false;
    }
}
