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

//done by debastab 
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
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
    //SecurityFilterChain replaced by Debastab Das 

@Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    http
        // Allow the React frontend to make cross-origin requests.
        .cors(cors -> {})

        // JWT-based stateless authentication.
        .csrf(csrf -> csrf.disable())

        .sessionManagement(session ->
            session.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS))

        .authorizeHttpRequests(auth -> auth
            // Login endpoints must be accessible before obtaining a JWT.
            .requestMatchers("/auth/**", "/error").permitAll()

            .requestMatchers("/admin/**").hasRole("ADMIN")

            .requestMatchers("/student/**").hasRole("STUDENT")

            .anyRequest().authenticated()
        )

        .addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOrigins(
        List.of("http://localhost:5173")
    );

    config.setAllowedMethods(
        List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
    );

    config.setAllowedHeaders(
        List.of("Authorization", "Content-Type", "Accept")
    );

    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", config);

    return source;
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