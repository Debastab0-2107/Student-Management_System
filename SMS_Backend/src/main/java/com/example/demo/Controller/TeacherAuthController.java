package com.example.demo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.util.JwtUtil;

/** Teacher login using the application's existing JWT infrastructure. */
@RestController
@RequestMapping("/auth/teacher")
public class TeacherAuthController {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public TeacherAuthController(
            JdbcTemplate jdbcTemplate,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /** POST /auth/teacher/login */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TeacherLoginRequest request) {
        if (request == null || isBlank(request.getTeacherId()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Teacher ID and password are required"));
        }

        String teacherId = request.getTeacherId().trim();

        List<CredentialRow> rows = jdbcTemplate.query(
                "SELECT tc.password_hash, tc.must_change_password " +
                "FROM teacher_credentials tc " +
                "JOIN faculty f ON f.teacher_id = tc.teacher_id " +
                "WHERE tc.teacher_id = ? AND f.status = 1",
                (rs, rowNum) -> new CredentialRow(
                        rs.getString("password_hash"),
                        rs.getInt("must_change_password") == 1),
                teacherId);

        if (rows.isEmpty() || !passwordEncoder.matches(
                request.getPassword(), rows.get(0).passwordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "Invalid teacher ID or password"));
        }

        CredentialRow credential = rows.get(0);
        String token = jwtUtil.generateToken(teacherId, "TEACHER");

        return ResponseEntity.ok(Map.of(
                "message", "Teacher login successful",
                "token", token,
                "teacherId", teacherId,
                "role", "TEACHER",
                "mustChangePassword", credential.mustChangePassword()));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static class TeacherLoginRequest {
        private String teacherId;
        private String password;

        public TeacherLoginRequest() {}

        public String getTeacherId() { return teacherId; }
        public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    private record CredentialRow(String passwordHash, boolean mustChangePassword) {}
}
