package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
 * SecurityConfig
 * --------------
 * Central Spring Security configuration.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /*
     * JWT filter responsible for reading and validating
     * Bearer tokens.
     */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /*
     * Constructor injection.
     */
    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /*
     * Configures Spring Security for the REST API.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            /*
             * Disable CSRF because authentication is stateless
             * and performed using JWT.
             */
            .csrf(csrf -> csrf.disable())

            /*
             * Do not create HTTP sessions for authentication.
             */
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))

            /*
             * Configure endpoint access.
             */
            .authorizeHttpRequests(auth -> auth

                /*
                 * Login must be accessible without a JWT.
                 */
                .requestMatchers(
                    "/auth/**",
                    "/error"
                ).permitAll()

                /*
                 * Every other endpoint requires authentication.
                 */
                .anyRequest().authenticated()
            )

            /*
             * Run our JWT filter before Spring Security's
             * username/password authentication filter.
             */
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }//END OF SecurityFilterChain
    
    /*
     * Creates the password encoder used by AuthServiceImpl.
     */
    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
}