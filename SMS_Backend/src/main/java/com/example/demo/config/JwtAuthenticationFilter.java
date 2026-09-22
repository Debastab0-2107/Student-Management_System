package com.example.demo.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
 * JwtAuthenticationFilter
 * -----------------------
 * Reads the JWT supplied in the HTTP Authorization header
 * and establishes the authenticated user inside Spring Security.
 *
 * Expected header:
 *
 * Authorization: Bearer <JWT>
 *
 * Flow:
 *
 * HTTP Request
 *      ↓
 * JwtAuthenticationFilter
 *      ↓
 * JwtUtil
 *      ↓
 * SecurityContext
 *      ↓
 * Controller
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /*
     * Utility responsible for validating and extracting
     * information from JWT tokens.
     */
    private final JwtUtil jwtUtil;

    /*
     * Constructor-based dependency injection.
     */
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /*
     * Executes once for every HTTP request.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        /*
         * Read the Authorization header.
         */
        String authorizationHeader =
                request.getHeader("Authorization");

        /*
         * Continue normally when no Authorization header
         * has been supplied.
         *
         * Public endpoints such as /auth/login can therefore
         * still be reached.
         */
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        /*
         * Remove "Bearer " from the beginning of the header
         * to obtain the actual JWT.
         */
        String token =
                authorizationHeader.substring(7);

        /*
         * Validate the token before trusting its contents.
         */
        if (jwtUtil.isTokenValid(token)) {

            /*
             * Extract the authenticated username.
             */
            String username =
                    jwtUtil.extractUsername(token);

            /*
             * Extract the user's role from the token.
             */
            String role =
                    jwtUtil.extractRole(token);

            /*
             * Create a Spring Security authority.
             *
             * Spring Security role conventions use the
             * ROLE_ prefix.
             */
            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + role);

            /*
             * Create an authenticated SecurityContext entry.
             */
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            java.util.List.of(authority));

            /*
             * Store the authentication for the current request.
             */
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);
        }

        /*
         * Continue through the remaining security filters
         * and eventually to the controller.
         */
        filterChain.doFilter(request, response);
    }
}