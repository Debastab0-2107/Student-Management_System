package com.example.demo.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.example.demo.config.JwtConfig;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final JwtConfig jwtConfig;

    public JwtUtil(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    /*
     * Generates a JWT containing the username and role.
     */
    public String generateToken(String username, String role) {

        Date issuedAt = new Date();

        Date expiration = new Date(
                issuedAt.getTime()
                        + jwtConfig.getExpiration());

        SecretKey signingKey = getSigningKey();

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    /*
     * Extracts the username from a valid JWT.
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
     * Checks whether the JWT is correctly signed and not expired.
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

        return role != null
                ? role.toString()
                : null;
    }

    /*
     * Creates the HMAC signing key from the configured JWT secret.
     *
     * SecretKey is used instead of the generic java.security.Key
     * because JJWT's verifyWith(...) requires a SecretKey for
     * HMAC-signed tokens.
     */
    private SecretKey getSigningKey() {

        byte[] keyBytes = jwtConfig
                .getSecret()
                .getBytes(StandardCharsets.UTF_8);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}