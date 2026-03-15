package com.securelens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SecureLensApplication - Main entry point for the Spring Boot backend.
 * Bootstraps the entire application context, including security, JPA, and REST APIs.
 */
@SpringBootApplication
public class SecureLensApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureLensApplication.class, args);
    }
}
