package com.example.demo.service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.response.LoginResponse;

/*
 * AuthService
 * -----------
 * Defines the business operations related to user authentication.
 *
 * Controller
 *     ↓
 * AuthService
 *     ↓
 * AuthServiceImpl
 *
 * The controller does not perform authentication logic directly.
 */
public interface AuthService {

    /*
     * Authenticates a user using the supplied login credentials.
     *
     * The implementation will:
     * 1. Validate the supplied credentials.
     * 2. Determine the user's role.
     * 3. Generate a JWT after successful authentication.
     * 4. Return the authentication information.
     */
    LoginResponse login(LoginRequest loginRequest);
}