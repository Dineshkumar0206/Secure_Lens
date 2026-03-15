package com.securelens.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * WebSecurityConfig - Configures Spring Security for JWT-based stateless auth.
 * - Disables sessions (stateless REST API)
 * - Configures CORS for React frontend (supports ports 3000 AND 3001)
 * - Allows public access to /api/auth/** endpoints
 * - Protects all other endpoints (require valid JWT)
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    /**
     * Read the comma-separated allowed origins from application.properties.
     * e.g. "http://localhost:3000,http://localhost:3001"
     */
    @Value("${app.cors.allowed-origins}")
    private String allowedOriginsRaw;

    /**
     * Register the JWT filter as a Spring bean.
     */
    @Bean
    public JwtAuthenticationFilter authenticationJwtTokenFilter() {
        return new JwtAuthenticationFilter();
    }

    /**
     * BCrypt password encoder — industry-standard for password hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * DaoAuthenticationProvider uses our UserDetailsService + BCrypt.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Expose the AuthenticationManager bean so controllers can use it.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
            throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * CORS configuration — parses the comma-separated origins list from properties.
     * Allows any React dev-server port (3000, 3001, etc.)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Split "http://localhost:3000,http://localhost:3001" into a proper list
        List<String> origins = Arrays.stream(allowedOriginsRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "Accept",
                "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Main security filter chain definition.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS with our configuration — MUST come before csrf disable
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF (not needed for stateless JWT REST API)
            .csrf(csrf -> csrf.disable())

            // No session management — fully stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Route authorization rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()   // Public: login & register
                .requestMatchers("/api/health").permitAll()    // Public: health check
                .requestMatchers("OPTIONS", "/**").permitAll() // Allow all CORS preflight
                .anyRequest().authenticated()                  // All else requires JWT
            )

            // Register our authentication provider
            .authenticationProvider(authenticationProvider())

            // Add JWT filter before the standard username/password filter
            .addFilterBefore(authenticationJwtTokenFilter(),
                             UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}