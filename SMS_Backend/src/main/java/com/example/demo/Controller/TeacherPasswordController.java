
package com.example.demo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/faculty/password")
public class TeacherPasswordController {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public TeacherPasswordController(
            JdbcTemplate jdbcTemplate,
            PasswordEncoder passwordEncoder) {

        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody PasswordUpdateRequest request) {

        // Check authentication
        if (authentication == null
                || authentication.getName() == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Teacher authentication is required"));
        }

        // Validate request
        if (request == null
                || isBlank(request.getCurrentPassword())
                || isBlank(request.getNewPassword())) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Current password and new password are required"));
        }

        // Get the logged-in teacher's ID from JWT authentication
        String teacherId = authentication.getName();

        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();

        // New password must be different
        if (currentPassword.equals(newPassword)) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New password must be different from current password"));
        }

        // Password validation
        String passwordPattern =
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@._-]).{8,}$";

        if (!newPassword.matches(passwordPattern)) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@ . - _)"));
        }

        // Retrieve the existing password hash
        List<String> passwordHashes = jdbcTemplate.query(
                "SELECT tc.password_hash " +
                "FROM teacher_credentials tc " +
                "JOIN faculty f ON f.teacher_id = tc.teacher_id " +
                "WHERE tc.teacher_id = ? AND f.status = 1",

                (rs, rowNum) -> rs.getString("password_hash"),

                teacherId
        );

        if (passwordHashes.isEmpty()
                || isBlank(passwordHashes.get(0))) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Teacher credentials not found or account is inactive"));
        }

        String storedPasswordHash = passwordHashes.get(0);

        // Verify current password
        if (!passwordEncoder.matches(
                currentPassword,
                storedPasswordHash)) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Current password is incorrect"));
        }

        // Encode the new password
        String newPasswordHash =
                passwordEncoder.encode(newPassword);

        // Update password and remove forced-change requirement
        int updatedRows = jdbcTemplate.update(
                "UPDATE teacher_credentials tc " +
                "JOIN faculty f ON f.teacher_id = tc.teacher_id " +
                "SET tc.password_hash = ?, " +
                "tc.must_change_password = 0 " +
                "WHERE tc.teacher_id = ? AND f.status = 1",

                newPasswordHash,
                teacherId
        );

        if (updatedRows == 0) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Password could not be updated"));
        }

        return ResponseEntity.ok(Map.of(
                "message",
                "Password changed successfully",
                "mustChangePassword",
                false
        ));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    // Request DTO
    public static class PasswordUpdateRequest {

        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
