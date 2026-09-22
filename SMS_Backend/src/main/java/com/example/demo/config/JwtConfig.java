package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/*
 * JwtConfig
 * ---------
 * This class stores the configuration values required for JWT
 * authentication in the Student Management System.
 *
 * The actual JWT generation and validation logic will be handled
 * separately by JwtUtil.
 *
 * Keeping configuration separate from JWT logic follows the
 * project's layered architecture.
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    /*
     * Secret key used for signing and validating JWT tokens.
     *
     * This value should NOT be hard-coded.
     * It will be supplied through application.properties
     * or environment variables.
     */
    private String secret;

    /*
     * Token expiration time in milliseconds.
     *
     * Example:
     * 3600000 = 1 hour
     */
    private long expiration;

    /*
     * Returns the configured JWT secret.
     */
    public String getSecret() {
        return secret;
    }

    /*
     * Sets the JWT secret.
     */
    public void setSecret(String secret) {
        this.secret = secret;
    }

    /*
     * Returns the JWT expiration time.
     */
    public long getExpiration() {
        return expiration;
    }

    /*
     * Sets the JWT expiration time.
     */
    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}