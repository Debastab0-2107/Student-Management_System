
package com.example.demo.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

@RestController
@RequestMapping("/faculty/profile")
public class TeacherProfileController {

    private final FacultyService facultyService;

    public TeacherProfileController(
            FacultyService facultyService) {

        this.facultyService = facultyService;
    }

    /*
     * GET /faculty/profile
     *
     * Retrieves the profile of the currently logged-in teacher.
     */
    @GetMapping
    public ResponseEntity<?> getMyProfile(
            Authentication authentication) {

        String teacherId = authentication.getName();

        Faculty faculty =
                facultyService.findById(teacherId);

        if (faculty == null || !faculty.isStatus()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(faculty);
    }

    /*
     * PUT /faculty/profile
     *
     * Updates only the editable profile fields
     * of the currently logged-in teacher.
     */
    @PutMapping
    public ResponseEntity<?> updateMyProfile(
            @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {

        try {

            String teacherId = authentication.getName();

            boolean updated =
                    facultyService.updateProfile(
                            teacherId,
                            request.getPhoneNumber(),
                            request.getAlternatePhoneNumber(),
                            request.getEmail(),
                            request.getEducationalDetails()
                    );

            if (!updated) {
                return ResponseEntity.notFound().build();
            }

            Faculty updatedFaculty =
                    facultyService.findById(teacherId);

            return ResponseEntity.ok(updatedFaculty);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /*
     * Request body for profile updates.
     */
    public static class ProfileUpdateRequest {

        private String phoneNumber;
        private String alternatePhoneNumber;
        private String email;
        private String educationalDetails;

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getAlternatePhoneNumber() {
            return alternatePhoneNumber;
        }

        public void setAlternatePhoneNumber(
                String alternatePhoneNumber) {
            this.alternatePhoneNumber = alternatePhoneNumber;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getEducationalDetails() {
            return educationalDetails;
        }

        public void setEducationalDetails(
                String educationalDetails) {
            this.educationalDetails = educationalDetails;
        }
    }
}
