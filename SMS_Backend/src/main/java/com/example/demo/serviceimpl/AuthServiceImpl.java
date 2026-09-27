package com.example.demo.serviceimpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.Student;
import com.example.demo.service.AuthService;
import com.example.demo.service.StudentService;
import com.example.demo.util.JwtUtil;

/**
 * AuthServiceImpl
 *
 * Implements authentication business logic for the application.
 *
 * Two authentication flows are supported:
 *
 * 1. Admin authentication
 *    - username + password
 *    - uses the configured admin credentials
 *
 * 2. Student authentication
 *    - studentId + password
 *    - retrieves the student from the database
 *    - verifies the password using BCrypt
 *    - generates a JWT with STUDENT role
 *
 * The actual student password is never stored or compared as
 * plain text in the database.
 */
@Service
public class AuthServiceImpl implements AuthService {

    /*
     * Service used to retrieve student records.
     */
    private final StudentService studentService;

    /*
     * BCrypt password encoder used for password verification.
     */
    private final PasswordEncoder passwordEncoder;

    /*
     * Utility responsible for creating JWT tokens.
     */
    private final JwtUtil jwtUtil;

    /*
     * Configured administrator username.
     */
    private final String adminUsername;

    /*
     * Configured administrator password.
     *
     * This is the existing application-level admin authentication
     * mechanism. Student passwords are stored separately as BCrypt
     * hashes in the student table.
     */
    private final String adminPassword;

    /*
     * Configured administrator role.
     */
    private final String adminRole;

    /**
     * Creates the authentication service.
     *
     * @param studentService student service used for student lookup
     * @param passwordEncoder BCrypt password encoder
     * @param jwtUtil JWT utility
     * @param adminUsername configured administrator username
     * @param adminPassword configured administrator password
     * @param adminRole configured administrator role
     */
    public AuthServiceImpl(
            StudentService studentService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            @org.springframework.beans.factory.annotation.Value(
                    "${auth.admin.username:admin}")
            String adminUsername,
            @org.springframework.beans.factory.annotation.Value(
                    "${auth.admin.password}")
            String adminPassword,
            @org.springframework.beans.factory.annotation.Value(
                    "${auth.admin.role:ADMIN}")
            String adminRole) {

        this.studentService = studentService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.adminRole = adminRole;
    }

    /**
     * Authenticates the configured administrator.
     *
     * The existing application admin login is preserved.
     *
     * @param username username supplied during login
     * @param password password supplied during login
     * @return JWT token when authentication succeeds
     */
    @Override
    public String loginAdmin(
            String username,
            String password) {

        if (isBlank(username) || isBlank(password)) {
            throw new IllegalArgumentException(
                    "Username and password are required");
        }

        /*
         * Compare the supplied credentials with the configured
         * administrator credentials.
         */
        if (!adminUsername.equals(username)
                || !adminPassword.equals(password)) {

            throw new IllegalArgumentException(
                    "Invalid admin username or password");
        }

        /*
         * Generate an ADMIN JWT.
         */
        return jwtUtil.generateToken(
                username,
                adminRole);
    }

    /**
     * Authenticates a student using studentId and password.
     *
     * The student ID identifies the database record and the supplied
     * password is verified against the stored BCrypt password hash.
     *
     * A successful login generates a JWT with:
     *
     * subject = studentId
     * role    = STUDENT
     *
     * @param studentId authority-assigned student ID
     * @param password student's password
     * @return JWT token when authentication succeeds
     */
    @Override
    public String loginStudent(
            String studentId,
            String password) {

        if (isBlank(studentId)
                || isBlank(password)) {

            throw new IllegalArgumentException(
                    "Student ID and password are required");
        }

        /*
         * Retrieve the student using the authority-assigned ID.
         */
        Student student =
                studentService.findByStudentId(studentId);

        if (student == null) {
            throw new IllegalArgumentException(
                    "Invalid student ID or password");
        }

        /*
         * A valid student record must contain a password hash.
         */
        if (isBlank(student.getPasswordHash())) {
            throw new IllegalStateException(
                    "Student password is not configured");
        }

        /*
         * Verify the supplied password against the BCrypt hash.
         *
         * The plain-text password is never compared directly with
         * the stored database value.
         */
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        student.getPasswordHash());

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid student ID or password");
        }

        /*
         * Generate the student's JWT.
         *
         * The student ID becomes the JWT subject so that later
         * authenticated requests can identify the student through
         * Authentication.getName().
         */
        return jwtUtil.generateToken(
                student.getStudentId(),
                "STUDENT");
    }

    /**
     * Finds a student by student ID.
     *
     * @param studentId authority-assigned student ID
     * @return matching student or null
     */
    @Override
    public Student findStudentById(String studentId) {

        if (isBlank(studentId)) {
            return null;
        }

        return studentService.findByStudentId(studentId);
    }

    /**
     * Checks whether a string is null, empty, or whitespace.
     *
     * @param value value to check
     * @return true when the value is blank
     */
    private boolean isBlank(String value) {

        return value == null
                || value.trim().isEmpty();
    }
}