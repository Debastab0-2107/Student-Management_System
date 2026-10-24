
package com.example.demo.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Marks;
import com.example.demo.service.MarksService;

/**
 * REST controller for creating, retrieving, updating, deleting,
 * and importing student marks.
 *
 * Sequential marks IDs are allocated from a database sequence table
 * to avoid duplicate IDs when multiple requests execute concurrently.
 */
@RestController
@RequestMapping("/marks")
public class MarksController {

    private final MarksService marksService;

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public MarksController(
            MarksService marksService,
            JdbcTemplate jdbcTemplate) {
        this.marksService = marksService;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Creates a marks record.
     */
    @PostMapping
    public ResponseEntity<Marks> createMarks(
            @RequestBody Marks marks) {

        Marks createdMarks = marksService.createMarks(marks);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMarks);
    }

    /**
     * Retrieves a marks record by its ID.
     */
    @GetMapping("/{marksId}")
    public ResponseEntity<Marks> getMarksById(
            @PathVariable String marksId) {

        Marks marks = marksService.getMarksById(marksId);

        if (marks == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(marks);
    }

    /**
     * Retrieves all marks records.
     */
    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }

    /**
     * Updates an existing marks record.
     */
    @PutMapping("/{marksId}")
    public ResponseEntity<String> updateMarks(
            @PathVariable String marksId,
            @RequestBody Marks marks) {

        marks.setMarksId(marksId);

        boolean updated = marksService.updateMarks(marks);

        if (!updated) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Marks record not found.");
        }

        return ResponseEntity.ok("Marks updated successfully.");
    }

    /**
     * Deletes a marks record.
     */
    @DeleteMapping("/{marksId}")
    public ResponseEntity<String> deleteMarks(
            @PathVariable String marksId) {

        boolean deleted = marksService.deleteMarks(marksId);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Marks record not found.");
        }

        return ResponseEntity.ok("Marks deleted successfully.");
    }

    /**
     * Allocates the next sequential marks ID.
     *
     * The sequence row is locked until the surrounding transaction
     * completes. This prevents concurrent uploads from allocating
     * the same ID, provided this method runs within a transaction.
     */
    private String generateNextMarksId() {

        Long nextValue = jdbcTemplate.queryForObject(
                "SELECT next_value FROM marks_id_sequence "
                + "WHERE sequence_name = ? FOR UPDATE",
                Long.class,
                "TEST_MARKS");

        if (nextValue == null || nextValue < 1) {
            throw new IllegalStateException(
                    "Marks ID sequence is missing or invalid.");
        }

        int updated = jdbcTemplate.update(
                "UPDATE marks_id_sequence "
                + "SET next_value = ? WHERE sequence_name = ?",
                nextValue + 1,
                "TEST_MARKS");

        if (updated != 1) {
            throw new IllegalStateException(
                    "Unable to update the marks ID sequence.");
        }

        return "TEST_MARKS_" + String.format("%03d", nextValue);
    }

    /**
     * Imports marks from an Excel workbook.
     *
     * Expected first-sheet columns:
     * studentId | subjectId | marks
     *
     * The supplied semester ID must match the semester assigned
     * to each subject in the subject table.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('TEACHER')")
    @Transactional
    public ResponseEntity<?> uploadMarksExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("semesterId") String semesterId) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Please upload a non-empty Excel file."));
        }

        if (semesterId == null || semesterId.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "semesterId is required."));
        }

        String filename = file.getOriginalFilename();

        if (filename == null
                || !filename.toLowerCase().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Only .xlsx files are supported."));
        }

        int processedRows = 0;
        List<String> errors = new ArrayList<>();

        try (Workbook workbook =
                     WorkbookFactory.create(file.getInputStream())) {

            if (workbook.getNumberOfSheets() == 0) {
                return ResponseEntity.badRequest().body(
                        Map.of("message", "The workbook contains no sheets."));
            }

            Sheet sheet = workbook.getSheetAt(0);

            if (sheet.getPhysicalNumberOfRows() < 2) {
                return ResponseEntity.badRequest().body(
                        Map.of("message", "The sheet contains no marks rows."));
            }

            DataFormatter formatter = new DataFormatter();
            Row header = sheet.getRow(0);

            if (header == null
                    || !"studentId".equalsIgnoreCase(
                            formatter.formatCellValue(header.getCell(0)).trim())
                    || !"subjectId".equalsIgnoreCase(
                            formatter.formatCellValue(header.getCell(1)).trim())
                    || !"marks".equalsIgnoreCase(
                            formatter.formatCellValue(header.getCell(2)).trim())) {

                return ResponseEntity.badRequest().body(Map.of(
                        "message",
                        "Required columns: studentId, subjectId, marks"));
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                String studentId =
                        formatter.formatCellValue(row.getCell(0)).trim();
                String subjectId =
                        formatter.formatCellValue(row.getCell(1)).trim();
                String markText =
                        formatter.formatCellValue(row.getCell(2)).trim();

                // Ignore completely blank rows.
                if (studentId.isBlank()
                        && subjectId.isBlank()
                        && markText.isBlank()) {
                    continue;
                }

                try {
                    if (studentId.isBlank()
                            || subjectId.isBlank()
                            || markText.isBlank()) {
                        errors.add("Row " + (i + 1)
                                + ": studentId, subjectId and marks are required.");
                        continue;
                    }

                    // Confirm that the student exists.
                    Integer studentCount = jdbcTemplate.queryForObject(
                            "SELECT COUNT(*) FROM student WHERE student_id = ?",
                            Integer.class,
                            studentId);

                    if (studentCount == null || studentCount == 0) {
                        errors.add("Row " + (i + 1)
                                + ": student ID does not exist.");
                        continue;
                    }

                    // Confirm that the subject exists in the selected semester.
                    Integer subjectCount = jdbcTemplate.queryForObject(
                            "SELECT COUNT(*) FROM subject "
                            + "WHERE subject_id = ? AND semester_id = ?",
                            Integer.class,
                            subjectId,
                            semesterId);

                    if (subjectCount == null || subjectCount == 0) {
                        errors.add("Row " + (i + 1)
                                + ": subject does not exist in the selected semester.");
                        continue;
                    }

                    double mark;

                    try {
                        mark = Double.parseDouble(markText);
                    } catch (NumberFormatException ex) {
                        errors.add("Row " + (i + 1)
                                + ": marks must be numeric.");
                        continue;
                    }

                    if (!Double.isFinite(mark) || mark < 0 || mark > 100) {
                        errors.add("Row " + (i + 1)
                                + ": marks must be between 0 and 100.");
                        continue;
                    }

                    // Create and persist the marks record.
                    Marks marks = new Marks();
                    marks.setMarksId(generateNextMarksId());
                    marks.setStudentId(studentId);
                    marks.setSubjectId(subjectId);
                    marks.setMarks(mark);

                    marksService.createMarks(marks);
                    processedRows++;

                } catch (Exception ex) {
                    // Log the detailed exception on the server, not in the response.
                    org.slf4j.LoggerFactory
                            .getLogger(MarksController.class)
                            .error("Failed to import marks at Excel row {}",
                                    i + 1, ex);

                    errors.add("Row " + (i + 1)
                            + ": unable to save this marks record.");
                }
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Excel processing completed.",
                    "processedRows", processedRows,
                    "errors", errors));

        } catch (IOException | EncryptedDocumentException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Unable to read the Excel file."));
        }
    }
}
