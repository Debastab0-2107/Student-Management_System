
package com.example.demo.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/teacher-credentials")
public class TeacherCredentialController {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public TeacherCredentialController(
            JdbcTemplate jdbcTemplate,
            PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<?> createCredentials(
            @RequestBody CredentialRequest request) {

        if (request == null
                || request.getTeacherId() == null
                || request.getTeacherId().isBlank()
                || request.getInitialPassword() == null
                || request.getInitialPassword().length() < 8) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                    "Teacher ID and a password of at least 8 characters are required"));
        }

        String teacherId = request.getTeacherId().trim();

        try {
            Boolean active = jdbcTemplate.queryForObject(
                "SELECT status FROM faculty WHERE teacher_id = ?",
                Boolean.class,
                teacherId
            );

            if (!Boolean.TRUE.equals(active)) {
                return ResponseEntity.badRequest().body(
                    Map.of("message", "Faculty member is inactive"));
            }

            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM teacher_credentials WHERE teacher_id = ?",
                Integer.class,
                teacherId
            );

            String passwordHash =
                passwordEncoder.encode(request.getInitialPassword());

            if (count != null && count > 0) {
                jdbcTemplate.update(
                    "UPDATE teacher_credentials " +
                    "SET password_hash = ?, must_change_password = 1 " +
                    "WHERE teacher_id = ?",
                    passwordHash, teacherId
                );
            } else {
                jdbcTemplate.update(
                    "INSERT INTO teacher_credentials " +
                    "(teacher_id, password_hash, must_change_password) " +
                    "VALUES (?, ?, 1)",
                    teacherId, passwordHash
                );
            }

            return ResponseEntity.ok(Map.of(
                "message", "Teacher credentials created/reset successfully",
                "teacherId", teacherId,
                "mustChangePassword", true
            ));

        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("message", "Faculty member not found"));
        }
    }

    public static class CredentialRequest {
        private String teacherId;
        private String initialPassword;

        public String getTeacherId() {
            return teacherId;
        }

        public void setTeacherId(String teacherId) {
            this.teacherId = teacherId;
        }

        public String getInitialPassword() {
            return initialPassword;
        }

        public void setInitialPassword(String initialPassword) {
            this.initialPassword = initialPassword;
        }
    }
}
