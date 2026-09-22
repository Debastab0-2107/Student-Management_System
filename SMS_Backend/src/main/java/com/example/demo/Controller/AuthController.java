package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.service.AuthService;

/*
 * AuthController
 * --------------
 * Handles authentication-related HTTP requests.
 *
 * Controller responsibility:
 *      HTTP Request
 *          ↓
 *      AuthController
 *          ↓
 *      AuthService
 *          ↓
 *      AuthServiceImpl
 *
 * The controller should not contain authentication business
 * logic. That responsibility belongs to the service layer.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    /*
     * Authentication service responsible for performing
     * the actual login operation.
     */
    private final AuthService authService;

    /*
     * Constructor-based dependency injection.
     *
     * Spring will provide the AuthService implementation
     * when creating this controller.
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /*
     * Login endpoint.
     *
     * HTTP:
     * POST /auth/login
     *
     * The client sends login credentials in LoginRequest.
     *
     * The service validates the credentials and returns
     * LoginResponse containing the authentication result.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest) {

        /*
         * Pass the login request to the service layer.
         *
         * No authentication logic is performed directly
         * inside the controller.
         */
        LoginResponse response = authService.login(loginRequest);

        /*
         * Return the service result to the client.
         */
        return ResponseEntity.ok(response);
    }
}