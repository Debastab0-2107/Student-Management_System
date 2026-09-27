package com.example.demo.service;

import com.example.demo.model.Student;

/**
 * AuthService
 *
 * Defines authentication-related business operations.
 *
 * This service supports two authentication flows:
 *
 * 1. Department/admin authentication
 *    - Uses the existing username and password flow.
 *
 * 2. Student authentication
 *    - Uses studentId and password.
 *    - The studentId comes from the authority-provided student record.
 *    - The password is verified against the BCrypt hash stored in
 *      the student table.
 *
 * JWT creation remains the responsibility of AuthServiceImpl because
 * it combines authentication with the application's JwtUtil.
 */
public interface AuthService {

    /**
     * Authenticates an administrative user.
     *
     * This preserves the existing admin login functionality.
     *
     * @param username admin username
     * @param password plain-text password supplied during login
     * @return JWT token for the authenticated admin
     */
    String loginAdmin(String username, String password);

    /**
     * Authenticates a student.
     *
     * The implementation must:
     *
     * - Find the student using studentId.
     * - Verify the supplied password against passwordHash.
     * - Generate a JWT whose subject is the studentId.
     * - Assign the STUDENT role to the generated JWT.
     *
     * @param studentId authority-assigned student ID
     * @param password plain-text password supplied by the student
     * @return JWT token for the authenticated student
     */
    String loginStudent(String studentId, String password);

    /**
     * Finds a student by student ID.
     *
     * This method is useful to authentication and other authentication-
     * related operations that need to inspect the authenticated student.
     *
     * @param studentId authority-assigned student ID
     * @return matching student, or null when not found
     */
    Student findStudentById(String studentId);
}