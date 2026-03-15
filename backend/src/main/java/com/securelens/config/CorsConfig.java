package com.securelens.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * CorsConfig – Servlet-level CORS filter registered at HIGHEST priority.
 *
 * This runs BEFORE Spring Security, so even preflight OPTIONS requests
 * get the correct Access-Control headers without hitting the auth filter.
 *
 * This fixes the error:
 *   "No 'Access-Control-Allow-Origin' header is present on the requested resource"
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsConfig implements Filter {

    /**
     * Comma-separated allowed origins from application.properties.
     * e.g. http://localhost:3000,http://localhost:3001
     */
    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsRaw;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest)  req;
        HttpServletResponse response = (HttpServletResponse) res;

        String requestOrigin = request.getHeader("Origin");

        // Parse allowed origins into a Set for O(1) lookup
        Set<String> allowedOrigins = new HashSet<>(
                Arrays.asList(allowedOriginsRaw.split(","))
        );
        // Trim whitespace from each origin
        Set<String> trimmed = new HashSet<>();
        for (String o : allowedOrigins) trimmed.add(o.trim());

        // Only set the header if the request origin is in our allow-list
        if (requestOrigin != null && trimmed.contains(requestOrigin)) {
            response.setHeader("Access-Control-Allow-Origin",      requestOrigin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods",     "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            response.setHeader("Access-Control-Allow-Headers",
                    "Authorization, Content-Type, Accept, Origin, " +
                    "Access-Control-Request-Method, Access-Control-Request-Headers");
            response.setHeader("Access-Control-Max-Age",           "3600");
            response.setHeader("Access-Control-Expose-Headers",    "Authorization");
        }

        // Respond immediately to OPTIONS preflight with 200 OK
        // — don't let it fall through to Spring Security
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return; // ← short-circuit, no further filter processing
        }

        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() {}
}