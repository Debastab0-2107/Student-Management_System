package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

//import com.example.demo.security.JwtAuthenticationFilter;

/**
 * SecurityConfig
 *
 * Configures Spring Security for the Student Management System.
 *
 * The application uses JWT-based stateless authentication.
 *
 * Authentication flow:
 *
 * Login request
 *     ↓
 * AuthController
 *     ↓
 * AuthService
 *     ↓
 * JWT generated
 *     ↓
 * Client sends JWT in Authorization header
 *     ↓
 * JwtAuthenticationFilter
 *     ↓
 * Spring Security
 *
 * Role-specific access:
 *
 * ADMIN
 *     → /admin/**
 *
 * STUDENT
 *     → /student/**
 *
 * Other existing application endpoints remain authenticated unless
 * explicitly permitted below.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /*
     * JWT filter responsible for reading and validating the JWT
     * from incoming requests.
     */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Creates the security configuration.
     *
     * @param jwtAuthenticationFilter JWT authentication filter
     */
    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Configures the application's HTTP security rules.
     *
     * Authentication endpoints are publicly accessible because a
     * user must be able to log in before obtaining a JWT.
     *
     * Student endpoints require the STUDENT role.
     *
     * Admin endpoints require the ADMIN role.
     *
     * All remaining application endpoints require authentication.
     *
     * @param http Spring Security HTTP security configuration
     * @return configured security filter chain
     * @throws Exception when security configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            /*
             * CSRF protection is disabled because the application
             * uses stateless JWT authentication rather than
             * browser session authentication.
             */
            .csrf(csrf -> csrf.disable())

            /*
             * Do not create HTTP sessions.
             *
             * Every authenticated request must carry its JWT.
             */
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS))

            /*
             * Define endpoint authorization rules.
             */
            .authorizeHttpRequests(auth -> auth

                    /*
                     * Admin and student login endpoints must be
                     * publicly accessible because users do not
                     * have a JWT before logging in.
                     */
                    .requestMatchers(
                            "/auth/**",
                            "/error")
                    .permitAll()

                    /*
                     * Only users with the ADMIN role can access
                     * department-admin endpoints.
                     */
                    .requestMatchers("/admin/**")
                    .hasRole("ADMIN")

                    /*
                     * Only users with the STUDENT role can access
                     * student-specific endpoints.
                     */
                    .requestMatchers("/student/**")
                    .hasRole("STUDENT")

                    /*
                     * Existing Subject, Marks, Faculty and other
                     * protected application endpoints remain
                     * accessible only to authenticated users.
                     */
                    .anyRequest()
                    .authenticated())

            /*
             * Run the JWT filter before Spring Security's normal
             * username/password authentication filter.
             */
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Creates the application's BCrypt password encoder.
     *
     * BCrypt is used for student passwords so that the actual
     * password is never stored in the database.
     *
     * @return BCrypt password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}