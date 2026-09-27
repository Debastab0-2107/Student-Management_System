package com.example.demo.Controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.ChangePasswordRequest;
import com.example.demo.dto.request.StudentProfileUpdateRequest;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;

/**
 * StudentController
 *
 * REST controller responsible for authenticated student operations.
 *
 * Student identity is obtained from the authenticated JWT.
 *
 * Authority-controlled fields:
 * - studentId
 * - name
 * - phoneNumber
 * - courseId
 * - sessionId
 *
 * These fields cannot be modified through this controller.
 *
 * Student-editable fields:
 * - email
 * - dateOfBirth
 * - fatherName
 * - fatherPhoneNumber
 * - motherName
 * - motherPhoneNumber
 * - password
 *
 * The controller does not expose the student's password hash.
 */
@RestController
@RequestMapping("/student")
public class StudentController {

    /*
     * Service layer responsible for student business operations.
     */
    private final StudentService studentService;

    /**
     * Creates the StudentController.
     *
     * @param studentService student service implementation
     */
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * Returns the profile of the currently authenticated student.
     *
     * Endpoint:
     *
     * GET /student/profile
     *
     * The student does not provide a studentId.
     * The ID is extracted from the authenticated JWT.
     *
     * @param authentication authenticated Spring Security context
     * @return student profile without passwordHash
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        String studentId =
                getAuthenticatedStudentId(authentication);

        if (studentId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Student authentication is required"));
        }

        Student student =
                studentService.findByStudentId(studentId);

        if (student == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Student not found"));
        }

        /*
         * Build the response explicitly so passwordHash is never
         * returned to the client.
         */
        return ResponseEntity.ok(
                buildStudentProfileResponse(student));
    }

    /**
     * Updates the currently authenticated student's editable profile.
     *
     * Endpoint:
     *
     * PUT /student/profile
     *
     * Request body:
     *
     * {
     *     "email": "student@example.com",
     *     "dateOfBirth": "2002-05-10",
     *     "fatherName": "Father Name",
     *     "fatherPhoneNumber": "9876543211",
     *     "motherName": "Mother Name",
     *     "motherPhoneNumber": "9876543212"
     * }
     *
     * The request DTO does not contain authority-controlled fields.
     *
     * @param authentication authenticated Spring Security context
     * @param request editable profile information
     * @return updated student profile
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody StudentProfileUpdateRequest request) {

        String studentId =
                getAuthenticatedStudentId(authentication);

        if (studentId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Student authentication is required"));
        }

        if (request == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Profile request cannot be null"));
        }

        try {

            boolean updated =
                    studentService.updateStudentProfile(
                            studentId,
                            request.getEmail(),
                            request.getDateOfBirth(),
                            request.getFatherName(),
                            request.getFatherPhoneNumber(),
                            request.getMotherName(),
                            request.getMotherPhoneNumber());

            if (!updated) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Student not found"));
            }

            Student updatedStudent =
                    studentService.findByStudentId(studentId);

            return ResponseEntity.ok(
                    buildStudentProfileResponse(updatedStudent));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()));
        }
    }

    /**
     * Changes the password of the currently authenticated student.
     *
     * Endpoint:
     *
     * PUT /student/password
     *
     * Request body:
     *
     * {
     *     "currentPassword": "9876543210",
     *     "newPassword": "MyNewPassword123"
     * }
     *
     * The studentId is taken from the JWT and is never accepted
     * from the request body.
     *
     * @param authentication authenticated Spring Security context
     * @param request password change request
     * @return password change result
     */
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        String studentId =
                getAuthenticatedStudentId(authentication);

        if (studentId == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Student authentication is required"));
        }

        if (request == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Password request cannot be null"));
        }

        try {

            boolean changed =
                    studentService.changePassword(
                            studentId,
                            request.getCurrentPassword(),
                            request.getNewPassword());

            if (!changed) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "message",
                                "Password could not be changed"));
            }

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password changed successfully"));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()));

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            e.getMessage()));
        }
    }

    /**
     * Extracts the student ID from the authenticated JWT.
     *
     * JwtUtil creates the JWT subject using the student's studentId.
     * Therefore Spring Security's Authentication.getName() contains
     * the student ID after successful authentication.
     *
     * @param authentication authenticated security context
     * @return authenticated student ID, or null when unavailable
     */
    private String getAuthenticatedStudentId(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {

            return null;
        }

        String studentId = authentication.getName();

        if (studentId == null
                || studentId.trim().isEmpty()) {

            return null;
        }

        return studentId;
    }

    /**
     * Builds the student profile response.
     *
     * passwordHash is deliberately excluded.
     *
     * @param student student database object
     * @return safe profile response map
     */
    private Map<String, Object> buildStudentProfileResponse(
            Student student) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("studentId", student.getStudentId());
        response.put("name", student.getName());
        response.put("phoneNumber", student.getPhoneNumber());
        response.put("email", student.getEmail());
        response.put("dateOfBirth", student.getDateOfBirth());
        response.put("courseId", student.getCourseId());
        response.put("sessionId", student.getSessionId());
        response.put("fatherName", student.getFatherName());
        response.put(
                "fatherPhoneNumber",
                student.getFatherPhoneNumber());
        response.put("motherName", student.getMotherName());
        response.put(
                "motherPhoneNumber",
                student.getMotherPhoneNumber());

        /*
         * This flag is useful to the frontend because it tells the
         * student whether the initial password still needs to be
         * changed.
         */
        response.put(
                "mustChangePassword",
                student.isMustChangePassword());

        return response;
    }
}