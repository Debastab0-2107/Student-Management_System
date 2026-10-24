
package com.example.demo.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.CAMarks;
import com.example.demo.service.CAMarksCalculationService;
import com.example.demo.service.CAExcelParserService;
import com.example.demo.service.CAExcelRow;
import com.example.demo.service.CAMarksService;

@RestController
@RequestMapping("/ca-marks")
public class CAMarksController {

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

    @PostMapping("/upload/{semesterId}/{caCode}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> uploadCAMarks(
            @PathVariable String semesterId,
            @PathVariable String caCode,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            if (authentication == null
                    || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Teacher authentication is required.");
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Please select an Excel file.");
            }

            if (!file.getOriginalFilename().toLowerCase()
                    .endsWith(".xlsx")) {
                return ResponseEntity.badRequest()
                        .body("Only .xlsx files are supported.");
            }

            if (semesterId == null
                    || !semesterId.matches("SEM[1-9][0-9]*")) {
                return ResponseEntity.badRequest()
                        .body("Semester must look like SEM1, SEM2, etc.");
            }

            if (caCode == null
                    || !caCode.matches("CA[1-9][0-9]*")) {
                return ResponseEntity.badRequest()
                        .body("CA number must look like CA1, CA2, etc.");
            }

            int caNo = Integer.parseInt(caCode.substring(2));
            String authenticatedTeacherId = authentication.getName();

            List<CAExcelRow> rows = excelParser.parse(file);
            List<CAMarks> records = new ArrayList<>();

            for (CAExcelRow row : rows) {

                // Prevent a teacher from uploading records under
                // another teacher's ID from the spreadsheet.
                if (!authenticatedTeacherId.equals(row.getTeacherId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("The Excel teacherId does not match "
                                    + "the authenticated teacher.");
                }

                double total = calculationService.calculateCAMarks(
                        row.getMcqMarks(),
                        row.getDescriptiveMarks());

                CAMarks record = new CAMarks();
                record.setMarksId("CA_" + UUID.randomUUID());
                record.setStudentId(row.getStudentId());
                record.setTeacherId(authenticatedTeacherId);
                record.setSubjectId(row.getSubjectId());
                record.setSem(semesterId);
                record.setCaNo(caNo);
                record.setTotalMarks(
                	    java.math.BigDecimal.valueOf(total)
                	);
                records.add(record);
            }

            // Save all records through the service transaction.
            caMarksService.saveAllCAMarks(records);

            return ResponseEntity.ok(
                    "Successfully uploaded " + records.size()
                    + " records for " + semesterId
                    + ", " + caCode + ".");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body("Unable to read the Excel file.");

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("CA marks upload failed: " + e.getClass().getSimpleName()
                            + " - " + e.getMessage());
        }
    }
}
