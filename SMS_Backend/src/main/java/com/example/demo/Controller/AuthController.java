package com.example.demo.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.service.AuthService;

/**
 * AuthController
 *
 * REST controller responsible for application authentication.
 *
 * This controller supports two separate login flows:
 *
 * 1. Admin login
 *    POST /auth/login
 *
 * 2. Student login
 *    POST /auth/student/login
 *
 * Admin authentication continues to use the existing LoginRequest.
 *
 * Student authentication uses only:
 *
 * {
 *     "studentId": "...",
 *     "password": "..."
 * }
 *
 * A successful login returns a JWT token.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    /*
     * Authentication service containing the authentication business logic.
     */
    private final AuthService authService;

    /**
     * Creates the AuthController.
     *
     * @param authService authentication service
     */
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Authenticates the department administrator.
     *
     * Endpoint:
     *
     * POST /auth/login
     *
     * Example request:
     *
     * {
     *     "username": "admin",
     *     "password": "..."
     * }
     *
     * @param request admin login request
     * @return JWT token when authentication succeeds
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            String token =
                    authService.loginAdmin(
                            request.getUsername(),
                            request.getPassword());

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Admin login successful",
                            "token", token,
                            "role", "ADMIN"));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            e.getMessage()));
        }
    }

    /**
     * Authenticates a student.
     *
     * Endpoint:
     *
     * POST /auth/student/login
     *
     * Example request:
     *
     * {
     *     "studentId": "MCA2026001",
     *     "password": "9876543210"
     * }
     *
     * The student ID is used to locate the student record.
     * The password is verified against the BCrypt hash stored
     * in the database.
     *
     * @param request student login request
     * @return JWT token when authentication succeeds
     */
    @PostMapping("/student/login")
    public ResponseEntity<?> studentLogin(
            @RequestBody StudentLoginRequest request) {

        try {

            if (request == null
                    || request.getStudentId() == null
                    || request.getStudentId().trim().isEmpty()
                    || request.getPassword() == null
                    || request.getPassword().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Student ID and password are required"));
            }

            String token =
                    authService.loginStudent(
                            request.getStudentId(),
                            request.getPassword());

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Student login successful",
                            "token", token,
                            "role", "STUDENT"));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            e.getMessage()));
        }
    }

    /**
     * Request DTO used specifically for student authentication.
     *
     * Keeping this request object separate from the admin
     * LoginRequest makes the two authentication contracts explicit.
     */
    public static class StudentLoginRequest {

        /*
         * Authority-assigned student ID.
         */
        private String studentId;

        /*
         * Plain-text password supplied during login.
         *
         * This value is used only for authentication and is never
         * stored directly in the database.
         */
        private String password;

        /**
         * Default constructor required for JSON deserialization.
         */
        public StudentLoginRequest() {
        }

        /**
         * Returns the student ID.
         *
         * @return student ID
         */
        public String getStudentId() {
            return studentId;
        }

        /**
         * Sets the student ID.
         *
         * @param studentId authority-assigned student ID
         */
        public void setStudentId(String studentId) {
            this.studentId = studentId;
        }

        /**
         * Returns the supplied password.
         *
         * @return plain-text password
         */
        public String getPassword() {
            return password;
        }

        /**
         * Sets the supplied password.
         *
         * @param password plain-text password
         */
        public void setPassword(String password) {
            this.password = password;
        }
    }
}