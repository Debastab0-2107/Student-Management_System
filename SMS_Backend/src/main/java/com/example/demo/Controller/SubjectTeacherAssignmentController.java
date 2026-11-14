
package com.example.demo.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.SubjectTeacherAssignmentExcelParser;
import com.example.demo.service.SubjectTeacherAssignmentExcelRow;
import com.example.demo.service.SubjectTeacherAssignmentService;

/**
 * Administrator endpoint for uploading subject-teacher assignments.
 */
@RestController
@RequestMapping("/api/admin/upload")
public class SubjectTeacherAssignmentController {

    private final SubjectTeacherAssignmentExcelParser parser;
    private final SubjectTeacherAssignmentService assignmentService;

    public SubjectTeacherAssignmentController(
            SubjectTeacherAssignmentExcelParser parser,
            SubjectTeacherAssignmentService assignmentService) {

        this.parser = parser;
        this.assignmentService = assignmentService;
    }

    /**
     * POST /api/admin/upload/assignments
     *
     * Request:
     * multipart/form-data
     * key: file
     * type: File (.xlsx)
     *
     * Only administrators can upload assignments.
     */
    @PostMapping("/assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadAssignments(
            @RequestParam("file") MultipartFile file) {

        try {

            // Step 1: Parse the Excel workbook.
            List<SubjectTeacherAssignmentExcelRow> rows =
                    parser.parse(file);

            // Step 2: Validate and save the assignments.
            int processed =
                    assignmentService.processUpload(rows);

            // Step 3: Return success response.
            return ResponseEntity.ok(
                    "Successfully processed "
                    + processed
                    + " teacher-subject assignment rows.");

        } catch (IllegalArgumentException exception) {

            return ResponseEntity.badRequest()
                    .body(exception.getMessage());

        } catch (IOException exception) {

            return ResponseEntity.badRequest()
                    .body("Unable to read the assignment Excel file.");

        } catch (Exception exception) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Assignment upload failed. Check the backend log.");
        }
    }
}
