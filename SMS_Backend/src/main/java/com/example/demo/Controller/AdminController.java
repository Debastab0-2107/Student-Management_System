package com.example.demo.Controller;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.demo.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.request.AdminChangePasswordRequest;
import com.example.demo.service.AuthService;

import com.example.demo.model.Student;
import com.example.demo.service.AdminService;
import com.example.demo.service.SubjectService;
import com.example.demo.dto.request.BatchPromotionRequest;
import com.example.demo.dto.request.BatchDeactivationRequest;


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
	private final AuthService authService;
	private final StudentService studentService;
	private final SubjectService subjectService;
    
    /**
     * Constructor-based dependency injection.
     *
     * @param adminService administrator service
     */
	public AdminController(
	        AdminService adminService,
	        AuthService authService,
	        StudentService studentService,
	        SubjectService subjectService) {

	    this.adminService = adminService;
	    this.authService = authService;
	    this.studentService = studentService;
	    this.subjectService = subjectService;
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
    
    @PutMapping("/faculty/regular/{teacherId}/deactivate")
    public ResponseEntity<?> deactivateRegularFacultyById(
            @PathVariable String teacherId) {

        try {
            boolean deactivated =
                    adminService.deactivateRegularFacultyById(teacherId);

            if (!deactivated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Regular faculty not found or already deactivated"
                        ));
            }

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Regular faculty deactivated successfully",
                    "teacherId",
                    teacherId,
                    "status",
                    false
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @PutMapping("/password")
    public ResponseEntity<?> changeAdminPassword(
            Authentication authentication,
            @RequestBody AdminChangePasswordRequest request) {

        try {

            String username = authentication.getName();

            authService.changeAdminPassword(
                    username,
                    request.getCurrentPassword(),
                    request.getNewPassword());

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Admin password changed successfully"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    
    //DEACTIVE student URL MAPPING
    @PutMapping("/students/{studentId}/deactivate")
    public ResponseEntity<?> deactivateStudent(
            @PathVariable String studentId) {

        try {

            boolean deactivated =
                    adminService.deactivateStudent(studentId);

            if (!deactivated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Student not found or already deactivated"
                        ));
            }

            return ResponseEntity.ok(Map.of(
                    "message",
                    "Student deactivated successfully",
                    "studentId",
                    studentId,
                    "active",
                    false
            ));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    
    //Added by Debastab on 2nd Nov  for list of all students
    /**
     * Retrieves all students for the Admin Student List page.
     *
     * GET /admin/students
     *
     * Password hashes and other sensitive authentication
     * information are deliberately excluded.
     */
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {

        try {

            List<Student> students = studentService.findAll();

            List<Map<String, Object>> response = new ArrayList<>();

            for (Student student : students) {

                Map<String, Object> studentData = new HashMap<>();

                studentData.put("studentId", student.getStudentId());
                studentData.put("name", student.getName());
                studentData.put("phoneNumber", student.getPhoneNumber());
                studentData.put("email", student.getEmail());
                studentData.put("courseId", student.getCourseId());
                studentData.put("sessionId", student.getSessionId());
                studentData.put("active", student.isActive());
                studentData.put(
                        "status",
                        student.isActive() ? "ACTIVE" : "INACTIVE"
                );

                response.add(studentData);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to retrieve student list"
                    ));
        }
    }
    
    /**
     * Uploads subjects using an administrator Excel file.
     *
     * POST /admin/subjects/upload
     *
     * Multipart field: file
     */
    @PostMapping("/subjects/upload")
    public ResponseEntity<?> uploadSubjects(
            @RequestParam("file") MultipartFile file) {

        try {

            int count = subjectService.importSubjectsFromExcel(file);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Subjects imported successfully",
                            "count",
                            count
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));

        } catch (Exception e) {

            org.slf4j.LoggerFactory
                    .getLogger(AdminController.class)
                    .error("Subject Excel import failed", e);

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to import subjects"
                    ));
        }
    }
    

/**
 * Updates existing subjects using an Excel file.
 *
 * POST /admin/subjects/update-upload
 *
 * Excel headers:
 * subjectId | subjectName | courseId | semesterId
 */
@PostMapping("/subjects/update-upload")
public ResponseEntity<?> updateSubjectsFromExcel(
        @RequestParam("file") MultipartFile file) {

    try {

        int count = subjectService.updateSubjectsFromExcel(file);

        return ResponseEntity.ok(Map.of(
                "message", "Subjects updated successfully",
                "updatedCount", count
        ));

    } catch (IllegalArgumentException e) {

        return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage()));

    } catch (Exception e) {

        org.slf4j.LoggerFactory
                .getLogger(AdminController.class)
                .error("Subject Excel update failed", e);

        return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to update subjects"));
    }
}

/**
 * Deactivates subjects using an Excel file.
 *
 * POST /admin/subjects/deactivate-upload
 *
 * Excel header:
 * subjectId
 */
@PostMapping("/subjects/deactivate-upload")
public ResponseEntity<?> deactivateSubjectsFromExcel(
        @RequestParam("file") MultipartFile file) {

    try {

        int count =
                subjectService.deactivateSubjectsFromExcel(file);

        return ResponseEntity.ok(Map.of(
                "message", "Subject deactivation completed",
                "deactivatedCount", count
        ));

    } catch (IllegalArgumentException e) {

        return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage()));

    } catch (Exception e) {

        org.slf4j.LoggerFactory
                .getLogger(AdminController.class)
                .error("Subject Excel deactivation failed", e);

        return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to deactivate subjects"));
    }
}


		//roll reg controller mapping
	@PostMapping("/students/university-identifiers/upload")
	public ResponseEntity<?> uploadUniversityIdentifiers(
        @RequestParam("file") MultipartFile file) {

    try {

        int count = adminService.uploadUniversityIdentifiers(file);

        return ResponseEntity.ok(Map.of(
                "message",
                "University identifiers uploaded successfully",
                "updatedCount",
                count
        ));

    } catch (IllegalArgumentException e) {

        return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage()));

    } catch (Exception e) {

        return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message",
                        "Failed to upload university identifiers"));
    }
}
	

	/**
	 * Promotes all active students in a selected batch
	 * from their current semester to the next semester.
	 *
	 * Example:
	 * PUT /admin/students/promote-batch
	 *
	 * The request identifies the batch and its current semester.
	 * The backend calculates the next semester.
	 */
	@PutMapping("/students/promote-batch")
	public ResponseEntity<Map<String, Object>> promoteStudentBatch(
	        @RequestBody BatchPromotionRequest request) {
	
	    if (request == null) {
	        return ResponseEntity.badRequest().body(
	                Map.of("message", "Request body is required.")
	        );
	    }
	
	    try {
	        int promotedCount = adminService.promoteStudentBatch(
	                request.getSessionId(),
	                request.getCourseId(),
	                request.getCurrentSemesterId()
	        );
	
	        String currentSemester = request.getCurrentSemesterId().trim();
	        int nextSemester = Integer.parseInt(currentSemester) + 1;
	
	        Map<String, Object> response = new HashMap<>();
	        response.put("success", true);
	        response.put("message",
	                promotedCount > 0
	                        ? "Batch promotion completed successfully."
	                        : "No eligible active students were found in this batch.");
	        response.put("sessionId", request.getSessionId());
	        response.put("courseId", request.getCourseId());
	        response.put("fromSemester", currentSemester);
	        response.put("toSemester", String.valueOf(nextSemester));
	        response.put("promotedCount", promotedCount);
	
	        return ResponseEntity.ok(response);
	
	    } catch (IllegalArgumentException ex) {
	        return ResponseEntity.badRequest().body(
	                Map.of(
	                        "success", false,
	                        "message", ex.getMessage()
	                )
	        );
	    } catch (Exception ex) {
	        // Replace or supplement this with your project's logger
	        // if one is already configured.
	        ex.printStackTrace();
	
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
	                Map.of(
	                        "success", false,
	                        "message", "Unable to promote the selected batch."
	                )
	        );
	    }
	}


	/**
	 * Deactivates all active students in a completed batch.
	 *
	 * PUT /admin/students/deactivate-batch
	 */
	@PutMapping("/students/deactivate-batch")
	public ResponseEntity<Map<String, Object>> deactivateStudentBatch(
	        @RequestBody BatchDeactivationRequest request) {
	
	    if (request == null) {
	        return ResponseEntity.badRequest().body(Map.of(
	            "success", false,
	            "message", "Request body is required."
	        ));
	    }
	
	    try {
	        int deactivatedCount = studentService.deactivateBatch(
	            request.getSessionId(),
	            request.getCourseId(),
	            request.getSemesterId()
	        );
	
	        Map<String, Object> response = new HashMap<>();
	
	        response.put("success", true);
	
	        response.put(
	            "message",
	            deactivatedCount > 0
	                ? "Student batch deactivated successfully."
	                : "No active students were found in the selected batch."
	        );
	
	        response.put("sessionId", request.getSessionId());
	        response.put("courseId", request.getCourseId());
	        response.put("semesterId", request.getSemesterId());
	        response.put("deactivatedCount", deactivatedCount);
	        response.put("active", false);
	
	        return ResponseEntity.ok(response);
	
	    } catch (IllegalArgumentException ex) {
	
	        return ResponseEntity.badRequest().body(Map.of(
	            "success", false,
	            "message", ex.getMessage()
	        ));
	
	    } catch (Exception ex) {
	
	        ex.printStackTrace();
	
	        return ResponseEntity.status(
	            HttpStatus.INTERNAL_SERVER_ERROR
	        ).body(Map.of(
	            "success", false,
	            "message", "Unable to deactivate the selected student batch."
	        ));
	    }
	}


}