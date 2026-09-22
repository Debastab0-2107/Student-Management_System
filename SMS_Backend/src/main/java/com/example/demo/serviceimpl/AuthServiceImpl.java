package com.example.demo.serviceimpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.service.AuthService;
import com.example.demo.util.JwtUtil;

/*
 * AuthServiceImpl
 * ---------------
 * Concrete implementation of AuthService.
 *
 * Flow:
 *
 * AuthController
 *      ↓
 * AuthService
 *      ↓
 * AuthServiceImpl
 *      ↓
 * JwtUtil
 *
 * This implementation currently uses credentials supplied through
 * application configuration/environment variables because the
 * available project model does not yet contain a dedicated User
 * authentication entity/table.
 */
@Service
public class AuthServiceImpl implements AuthService {

    /*
     * Username configured for the initial administrator account.
     *
     * The value comes from:
     * auth.admin.username
     */
    @Value("${auth.admin.username}")
    private String configuredUsername;

    /*
     * Password configured for the initial administrator account.
     *
     * This should be supplied through an environment variable.
     */
    @Value("${auth.admin.password}")
    private String configuredPassword;

    /*
     * Role assigned to the configured authentication account.
     *
     * Default role is ADMIN.
     */
    @Value("${auth.admin.role:ADMIN}")
    private String configuredRole;

    /*
     * Utility responsible for creating JWT tokens.
     */
    private final JwtUtil jwtUtil;

    /*
     * PasswordEncoder is used so that a configured password can
     * be compared using Spring Security's password hashing
     * mechanism when a hashed password is supplied.
     */
    private final PasswordEncoder passwordEncoder;

    /*
     * Constructor-based dependency injection.
     */
    public AuthServiceImpl(
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {

        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /*
     * Authenticates a user and generates a JWT token.
     */
    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        /*
         * Reject a missing request.
         */
        if (loginRequest == null) {
            throw new IllegalArgumentException(
                    "Login request cannot be null");
        }

        /*
         * Read the credentials supplied by the client.
         */
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        /*
         * Validate that both fields were supplied.
         */
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException(
                    "Username is required");
        }

        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required");
        }

        /*
         * Verify the configured username first.
         */
        if (!configuredUsername.equals(username)) {
            throw new IllegalArgumentException(
                    "Invalid username or password");
        }

        /*
         * The configured password may be stored either as:
         *
         * 1. a BCrypt hash, or
         * 2. plain text during local development.
         *
         * BCrypt is preferred.
         */
        boolean passwordMatches;

        if (isBcryptHash(configuredPassword)) {

            /*
             * Compare the submitted password against the BCrypt hash.
             */
            passwordMatches =
                    passwordEncoder.matches(
                            password,
                            configuredPassword);

        } else {

            /*
             * Plain-text comparison is retained only as a development
             * fallback when a BCrypt hash has not yet been configured.
             *
             * Production deployment should use a password hash.
             */
            passwordMatches =
                    configuredPassword.equals(password);
        }

        /*
         * Reject invalid credentials.
         */
        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid username or password");
        }

        /*
         * Credentials are valid, therefore generate a JWT.
         */
        String token = jwtUtil.generateToken(
                username,
                configuredRole);

        /*
         * Return the authentication information.
         */
        return new LoginResponse(
                token,
                username,
                configuredRole);
    }

    /*
     * Determines whether the configured password looks like
     * a BCrypt password hash.
     */
    private boolean isBcryptHash(String password) {

        return password != null
                && (password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$"));
    }
}