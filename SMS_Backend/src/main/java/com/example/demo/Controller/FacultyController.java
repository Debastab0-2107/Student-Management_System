package com.example.demo.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

/**
 * FacultyController
 *
 * Handles Faculty-related HTTP requests.
 *
 * IMPORTANT:
 *
 * This controller is intended for administrator-controlled
 * Visiting Faculty management.
 *
 * Regular/Permanent Faculty are NOT added through this controller.
 * They are imported by Admin through the authority-provided Excel file.
 *
 * Regular Faculty deactivation is also handled through the
 * authority-provided Excel file.
 *
 * Visiting Faculty:
 *
 * - Add directly by Admin
 * - View
 * - Update
 * - Deactivate
 *
 * Faculty records are never physically deleted.
 * Deactivation changes status to false.
 *
 * Security:
 *
 * The /admin/** endpoints are protected by SecurityConfig and
 * require an ADMIN JWT.
 */
@RestController
@RequestMapping("/admin/faculty")
public class FacultyController {

    /*
     * Faculty business service.
     */
    private final FacultyService facultyService;

    /**
     * Constructor-based dependency injection.
     *
     * @param facultyService faculty service
     */
    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    /**
     * Adds a new Visiting Faculty member.
     *
     * HTTP:
     *
     * POST /admin/faculty/visiting
     *
     * Example request:
     *
     * {
     *   "teacherId": "VF001",
     *   "name": "Amit Das",
     *   "phoneNumber": "9876543210",
     *   "facultyType": "VISITING",
     *   "deptId": "MCA",
     *   "status": true
     * }
     *
     * The facultyType is forcibly set to VISITING so that the
     * endpoint cannot accidentally create a Regular Faculty record.
     *
     * @param faculty visiting faculty information
     * @return saved visiting faculty
     */
    @PostMapping("/visiting")
    public ResponseEntity<?> createVisitingFaculty(
            @RequestBody Faculty faculty) {

        try {

            /*
             * This endpoint is specifically for Visiting Faculty.
             */
            faculty.setFacultyType("VISITING");

            /*
             * Newly created visiting faculty are active.
             */
            faculty.setStatus(true);

            Faculty savedFaculty =
                    facultyService.save(faculty);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedFaculty);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    /**
     * Retrieves a faculty member by teacher ID.
     *
     * HTTP:
     *
     * GET /admin/faculty/{teacherId}
     *
     * @param teacherId faculty identifier
     * @return faculty if found
     */
    @GetMapping("/{teacherId}")
    public ResponseEntity<Faculty> findById(
            @PathVariable String teacherId) {

        Faculty faculty =
                facultyService.findById(teacherId);

        if (faculty == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(faculty);
    }

    /**
     * Retrieves all faculty records.
     *
     * Both active and inactive records are returned.
     *
     * HTTP:
     *
     * GET /admin/faculty
     *
     * @return all faculty records
     */
    @GetMapping
    public ResponseEntity<List<Faculty>> findAll() {

        List<Faculty> facultyList =
                facultyService.findAll();

        return ResponseEntity.ok(facultyList);
    }

    /**
     * Updates a Visiting Faculty record.
     *
     * HTTP:
     *
     * PUT /admin/faculty/visiting/{teacherId}
     *
     * The teacher ID comes from the URL.
     * The faculty type is forced to VISITING.
     *
     * @param teacherId visiting faculty identifier
     * @param faculty updated information
     * @return updated faculty
     */
    @PutMapping("/visiting/{teacherId}")
    public ResponseEntity<?> updateVisitingFaculty(
            @PathVariable String teacherId,
            @RequestBody Faculty faculty) {

        try {

            /*
             * Ensure that the URL identifies the record being updated.
             */
            faculty.setTeacherId(teacherId);

            /*
             * This endpoint can only update Visiting Faculty.
             */
            faculty.setFacultyType("VISITING");

            boolean updated =
                    facultyService.update(faculty);

            if (!updated) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(
                    facultyService.findById(teacherId));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    /**
     * Deactivates a Visiting Faculty member.
     *
     * HTTP:
     *
     * DELETE /admin/faculty/visiting/{teacherId}
     *
     * IMPORTANT:
     *
     * Despite using HTTP DELETE, the database record is NOT
     * physically deleted.
     *
     * The status is changed to false.
     *
     * This preserves historical academic information.
     *
     * @param teacherId visiting faculty identifier
     * @return success response
     */
    @DeleteMapping("/visiting/{teacherId}")
    public ResponseEntity<?> deactivateVisitingFaculty(
            @PathVariable String teacherId) {

        try {

            /*
             * Find the faculty first.
             */
            Faculty faculty =
                    facultyService.findById(teacherId);

            if (faculty == null) {
                return ResponseEntity.notFound().build();
            }

            /*
             * Prevent accidentally deactivating a Regular Faculty
             * through the Visiting Faculty endpoint.
             */
            if (!"VISITING".equalsIgnoreCase(
                    faculty.getFacultyType())) {

                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(
                                java.util.Map.of(
                                        "message",
                                        "Only visiting faculty can be "
                                                + "deactivated through this endpoint"
                                )
                        );
            }

            /*
             * Soft-delete / deactivate the faculty.
             */
            boolean deactivated =
                    facultyService.deactivateById(
                            teacherId);

            if (!deactivated) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message",
                            "Visiting faculty deactivated successfully",
                            "teacherId",
                            teacherId
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}