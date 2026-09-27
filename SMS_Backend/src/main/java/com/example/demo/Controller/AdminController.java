package com.example.demo.Controller;

import java.util.List;

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
 * Handles administrator-related HTTP requests.
 *
 * Current responsibility:
 *
 * - Accept the authority-provided Excel file.
 * - Send the file to AdminService.
 * - Return the result of the student import operation.
 *
 * Controller flow:
 *
 * HTTP Request
 *      ↓
 * AdminController
 *      ↓
 * AdminService
 *      ↓
 * AdminServiceImpl
 *      ↓
 * StudentExcelParser
 *      ↓
 * StudentService
 *      ↓
 * StudentDao
 *      ↓
 * MySQL
 *
 * Administrative business logic remains inside the service layer.
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    /*
     * Service responsible for administrator operations.
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
     * Uploads the authority-provided Excel sheet and imports
     * the student records into the database.
     *
     * HTTP:
     *
     * POST /admin/students/upload
     *
     * Request type:
     *
     * multipart/form-data
     *
     * Form field:
     *
     * file = Excel file
     *
     * The endpoint is protected by SecurityConfig, which requires
     * the caller to have the ADMIN role for /admin/** endpoints.
     *
     * @param file uploaded Excel file
     * @return imported students
     */
    @PostMapping("/students/upload")
    public ResponseEntity<?> uploadStudents(
            @RequestParam("file") MultipartFile file) {

        try {

            /*
             * Pass the uploaded file to the service layer.
             */
            List<Student> importedStudents =
                    adminService.importStudentsFromExcel(file);

            /*
             * Return the number of successfully imported students.
             *
             * Do not return Student entities directly because they
             * contain passwordHash internally.
             */
            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message",
                            "Students imported successfully",
                            "count",
                            importedStudents.size()
                    )
            );

        } catch (IllegalArgumentException e) {

            /*
             * Excel validation errors, duplicate student IDs,
             * missing required fields, and similar client-side
             * import errors are returned as HTTP 400.
             */
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            /*
             * Unexpected import errors are returned as HTTP 500.
             */
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    "Failed to import students"
                            )
                    );
        }
    }
}