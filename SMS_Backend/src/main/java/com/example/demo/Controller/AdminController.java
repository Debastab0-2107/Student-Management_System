package com.example.demo.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Student;
import com.example.demo.service.AdminService;

/**
 * AdminController
 *
 * Handles administrator-specific HTTP requests.
 *
 * All endpoints under /admin/** are protected by Spring Security
 * and require an ADMIN JWT.
 *
 * Responsibilities:
 *
 * 1. Import students from authority Excel.
 * 2. Import regular/permanent faculty from authority Excel.
 * 3. Deactivate regular/permanent faculty using authority Excel.
 *
 * Visiting faculty are handled separately through FacultyController.
 *
 * Architecture:
 *
 * HTTP Request
 *      ↓
 * AdminController
 *      ↓
 * AdminService
 *      ↓
 * Appropriate business service
 *      ↓
 * DAO
 *      ↓
 * MySQL
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    /*
     * Administrator business service.
     */
    private final AdminService adminService;

    /**
     * Constructor-based dependency injection.
     *
     * @param adminService administrator service
     */
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Uploads the authority-provided Student Excel file.
     *
     * HTTP:
     *
     * POST /admin/students/upload
     *
     * Content type:
     *
     * multipart/form-data
     *
     * Form field:
     *
     * file
     *
     * @param file authority student Excel
     * @return import result
     */
    @PostMapping("/students/upload")
    public ResponseEntity<?> uploadStudents(
            @RequestParam("file") MultipartFile file) {

        try {

            /*
             * Import students through the service layer.
             */
            List<Student> importedStudents =
                    adminService.importStudentsFromExcel(file);

            /*
             * Do not expose Student objects because they
             * internally contain passwordHash.
             */
            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Students imported successfully",
                            "count",
                            importedStudents.size()
                    )
            );

        } catch (IllegalArgumentException e) {

            /*
             * Client-side Excel/business validation error.
             */
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            /*
             * Unexpected server-side error.
             */
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to import students"
                            )
                    );
        }
    }

    /**
     * Uploads the authority-provided Regular Faculty Excel file.
     *
     * HTTP:
     *
     * POST /admin/faculty/regular/upload
     *
     * Content type:
     *
     * multipart/form-data
     *
     * Form field:
     *
     * file
     *
     * Expected Excel columns:
     *
     * teacherId | name | phoneNumber | facultyType | deptId
     *
     * @param file authority regular faculty Excel
     * @return number of imported faculty records
     */
    @PostMapping("/faculty/regular/upload")
    public ResponseEntity<?> uploadRegularFaculty(
            @RequestParam("file") MultipartFile file) {

        try {

            /*
             * Import regular faculty through AdminService.
             */
            int count =
                    adminService
                            .importRegularFacultyFromExcel(file);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Regular faculty imported successfully",
                            "count",
                            count
                    )
            );

        } catch (IllegalArgumentException e) {

            /*
             * Excel validation or business validation error.
             */
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            /*
             * Unexpected server-side error.
             */
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to import regular faculty"
                            )
                    );
        }
    }

    /**
     * Deactivates Regular Faculty using an authority Excel file.
     *
     * HTTP:
     *
     * POST /admin/faculty/regular/deactivate
     *
     * Content type:
     *
     * multipart/form-data
     *
     * Form field:
     *
     * file
     *
     * Expected Excel column:
     *
     * teacherId
     *
     * No physical database deletion is performed.
     * The faculty status becomes false.
     *
     * @param file authority deactivation Excel
     * @return number of deactivated faculty records
     */
    @PostMapping("/faculty/regular/deactivate")
    public ResponseEntity<?> deactivateRegularFaculty(
            @RequestParam("file") MultipartFile file) {

        try {

            /*
             * Deactivate faculty through AdminService.
             */
            int count =
                    adminService
                            .deactivateRegularFacultyFromExcel(
                                    file);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Regular faculty deactivated successfully",
                            "count",
                            count
                    )
            );

        } catch (IllegalArgumentException e) {

            /*
             * Validation or business error.
             */
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            /*
             * Unexpected server-side error.
             */
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Failed to deactivate regular faculty"
                            )
                    );
        }
    }
}