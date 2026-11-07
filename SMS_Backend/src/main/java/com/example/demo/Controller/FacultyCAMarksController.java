package com.example.demo.Controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CAMarks;
import com.example.demo.service.CAMarksService;

/**
 * Provides semester-wise CA marks viewing for faculty.
 *
 * Only authenticated teachers can access this controller.
 */
@RestController
@RequestMapping("/faculty/ca-marks")
@PreAuthorize("hasRole('TEACHER')")
public class FacultyCAMarksController {

    private final CAMarksService caMarksService;

    public FacultyCAMarksController(CAMarksService caMarksService) {
        this.caMarksService = caMarksService;
    }

    /**
     * Retrieves all CA marks for the requested semester.
     *
     * GET /faculty/ca-marks/semester/{semesterId}
     *
     * Example:
     * GET /faculty/ca-marks/semester/SEM1
     */
    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<?> getCAMarksBySemester(
            @PathVariable String semesterId) {

        /*
         * Validate semester ID format.
         */
        if (semesterId == null
                || !semesterId.matches("SEM[1-9][0-9]*")) {

            return ResponseEntity.badRequest()
                    .body("Invalid semester ID. Use SEM1, SEM2, etc.");
        }

        /*
         * Retrieve CA records for the selected semester.
         */
        List<CAMarks> marks =
                caMarksService.getCAMarksBySemesterId(semesterId);

        return ResponseEntity.ok(convertCAMarks(marks));
    }

    /**
     * Converts CA entities into a response without a CA number.
     */
    private List<Map<String, Object>> convertCAMarks(
            List<CAMarks> marks) {

        List<Map<String, Object>> response = new ArrayList<>();

        for (CAMarks mark : marks) {

            Map<String, Object> item = new LinkedHashMap<>();

            item.put("marksId", mark.getMarksId());
            item.put("studentId", mark.getStudentId());
            item.put("subjectId", mark.getSubjectId());
            item.put("teacherId", mark.getTeacherId());
            item.put("semesterId", mark.getSem());
            item.put("totalMarks", mark.getTotalMarks());

            response.add(item);
        }

        return response;
    }
}