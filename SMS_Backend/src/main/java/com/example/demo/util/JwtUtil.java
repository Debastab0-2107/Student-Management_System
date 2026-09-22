package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.demo.config.JwtConfig;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/*
 * JwtUtil
 * -------
 * Responsible for creating and validating JSON Web Tokens.
 *
 * AuthServiceImpl uses this class instead of directly handling
 * JWT implementation details.
 */
@Component
public class JwtUtil {

    /*
     * JWT configuration supplied by JwtConfig.
     */
    private final JwtConfig jwtConfig;

    /*
     * Constructor-based dependency injection.
     */
    public JwtUtil(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    /*
     * Generates a JWT for an authenticated user.
     *
     * The username is stored as the JWT subject.
     * The user's role is stored as a custom claim.
     */
    public String generateToken(String username, String role) {

        /*
         * Current time is used as the token creation time.
         */
        Date issuedAt = new Date();

        /*
         * Calculate the expiration time.
         */
        Date expiration = new Date(
                issuedAt.getTime()
                        + jwtConfig.getExpiration());

        /*
         * Create the signing key from the configured secret.
         */
        Key signingKey = getSigningKey();

        /*
         * Build and return the JWT.
         */
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    /*
     * Extracts the username/subject from a JWT.
     */
    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /*
     * Validates the JWT signature and expiration.
     *
     * If parsing fails, the token is considered invalid.
     */
    public boolean isTokenValid(String token) {

        try {

            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    /*
     * Extracts the role stored inside the JWT.
     */
    public String extractRole(String token) {

        Object role = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");

        return role != null ? role.toString() : null;
    }

    /*
     * Creates the cryptographic signing key.
     *
     * The JWT secret must be sufficiently long for the HS256
     * signing algorithm.
     */
    private Key getSigningKey() {

        byte[] keyBytes = jwtConfig
                .getSecret()
                .getBytes(StandardCharsets.UTF_8);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}