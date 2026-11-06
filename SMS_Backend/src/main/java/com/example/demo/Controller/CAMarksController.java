package com.example.demo.Controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.CAMarks;
import com.example.demo.service.CAExcelParserService;
import com.example.demo.service.CAExcelRow;
import com.example.demo.service.CAMarksCalculationService;
import com.example.demo.service.CAMarksService;

/**
 * Controller for uploading Continuous Assessment marks.
 *
 * The project now maintains one CA result for each student,
 * subject and semester.
 *
 * The upload URL no longer accepts CA1 or CA2.
 */
@RestController
@RequestMapping("/ca-marks")
public class CAMarksController {

    private static final Logger logger =
            LoggerFactory.getLogger(CAMarksController.class);

    private final CAMarksService caMarksService;
    private final CAExcelParserService excelParser;
    private final CAMarksCalculationService calculationService;

    public CAMarksController(
            CAMarksService caMarksService,
            CAExcelParserService excelParser,
            CAMarksCalculationService calculationService) {

        this.caMarksService = caMarksService;
        this.excelParser = excelParser;
        this.calculationService = calculationService;
    }

    /**
     * Uploads CA marks for a particular semester.
     *
     * HTTP method: POST
     * Endpoint: /ca-marks/upload/{semesterId}
     *
     * Example:
     * /ca-marks/upload/SEM1
     *
     * Request:
     * Multipart form-data
     * Key: file
     *
     * Only authenticated teachers can upload CA marks.
     */
    @PostMapping("/upload/{semesterId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> uploadCAMarks(
            @PathVariable String semesterId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {

            /*
             * Confirm that the request has an authenticated teacher.
             */
            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Teacher authentication is required.");
            }

            /*
             * Validate the uploaded file.
             */
            if (file == null || file.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Please select a non-empty Excel file.");
            }

            String originalFilename = file.getOriginalFilename();

            if (originalFilename == null
                    || !originalFilename.toLowerCase().endsWith(".xlsx")) {

                return ResponseEntity.badRequest()
                        .body("Only .xlsx Excel files are supported.");
            }

            /*
             * Validate semester format.
             */
            if (semesterId == null
                    || !semesterId.matches("SEM[1-9][0-9]*")) {

                return ResponseEntity.badRequest()
                        .body("Semester must look like SEM1, SEM2, etc.");
            }

            /*
             * Obtain the teacher ID from the authenticated JWT.
             */
            String authenticatedTeacherId = authentication.getName();

            /*
             * Parse the complete Excel file before writing to the database.
             */
            List<CAExcelRow> rows = excelParser.parse(file);

            List<CAMarks> records = new ArrayList<>();

            /*
             * Prevent duplicate student/subject combinations
             * inside the same uploaded workbook.
             */
            Set<String> keysInWorkbook = new HashSet<>();

            for (CAExcelRow row : rows) {

                /*
                 * Do not allow a teacher to upload records using
                 * another teacher's ID in the Excel sheet.
                 */
                if (!authenticatedTeacherId.equals(row.getTeacherId())) {

                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("The Excel teacherId does not match "
                                    + "the authenticated teacher.");
                }

                /*
                 * Create the unique business key for this CA record.
                 */
                String businessKey =
                        row.getStudentId() + "\u0000"
                        + row.getSubjectId() + "\u0000"
                        + semesterId;

                /*
                 * Reject duplicate combinations within this workbook.
                 */
                if (!keysInWorkbook.add(businessKey)) {

                    return ResponseEntity.badRequest().body(
                            "Duplicate studentId/subject_id combination "
                            + "found in the Excel file for semester "
                            + semesterId + ": "
                            + row.getStudentId() + " / "
                            + row.getSubjectId());
                }

                /*
                 * Calculate the CA total using the existing
                 * CA calculation service.
                 */
                double total = calculationService.calculateCAMarks(
                        row.getMcqMarks(),
                        row.getDescriptiveMarks());

                /*
                 * Create the single CA entity.
                 *
                 * No caNo field is assigned because CA1/CA2
                 * classification has been removed.
                 */
                CAMarks record = new CAMarks();

                record.setMarksId("CA_" + UUID.randomUUID());
                record.setStudentId(row.getStudentId());
                record.setTeacherId(authenticatedTeacherId);
                record.setSubjectId(row.getSubjectId());
                record.setSem(semesterId);
                record.setTotalMarks(BigDecimal.valueOf(total));

                records.add(record);
            }

            /*
             * Insert new combinations and update existing combinations.
             *
             * The DAO processes the complete batch in one transaction.
             */
            caMarksService.saveAllCAMarks(records);

            return ResponseEntity.ok(
                    "Successfully processed "
                    + records.size()
                    + " single-CA records for "
                    + semesterId
                    + ". Existing records for the same student, "
                    + "subject and semester were updated.");

        } catch (IllegalArgumentException exception) {

            /*
             * Invalid Excel content or invalid marks.
             */
            return ResponseEntity.badRequest()
                    .body(exception.getMessage());

        } catch (IOException exception) {

            /*
             * Excel file could not be read.
             */
            logger.error("Unable to read CA Excel file.", exception);

            return ResponseEntity.badRequest()
                    .body("Unable to read the Excel file.");

        } catch (Exception exception) {

            /*
             * Unexpected database or application error.
             */
            logger.error("Single-CA Excel upload failed.", exception);

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("CA marks upload failed. Check the backend log.");
        }
    }
}