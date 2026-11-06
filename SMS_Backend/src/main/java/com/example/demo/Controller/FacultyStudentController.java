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

import com.example.demo.dto.response.FacultyStudentResponse;
import com.example.demo.model.CAMarks;
import com.example.demo.service.CAMarksService;
import com.example.demo.service.FacultyStudentService;

/**
 * Controller for faculty access to student details and CA marks.
 *
 * Only authenticated teachers can access these endpoints.
 */
@RestController
@RequestMapping("/faculty")
@PreAuthorize("hasRole('TEACHER')")
public class FacultyStudentController {

    private final FacultyStudentService facultyStudentService;
    private final CAMarksService caMarksService;

    public FacultyStudentController(
            FacultyStudentService facultyStudentService,
            CAMarksService caMarksService) {

        this.facultyStudentService = facultyStudentService;
        this.caMarksService = caMarksService;
    }

    /**
     * Retrieves all student details.
     *
     * GET /faculty/students
     */
    @GetMapping("/students")
    public ResponseEntity<List<FacultyStudentResponse>>
            getAllStudents() {

        return ResponseEntity.ok(
                facultyStudentService.getAllStudents());
    }

    /**
     * Retrieves CA marks of all students.
     *
     * GET /faculty/ca-marks
     */
    @GetMapping("/ca-marks")
    public ResponseEntity<List<Map<String, Object>>>
            getAllCAMarks() {

        List<CAMarks> marks =
                caMarksService.getAllCAMarks();

        return ResponseEntity.ok(convertCAMarks(marks));
    }

    /**
     * Retrieves CA marks belonging to one student.
     *
     * GET /faculty/students/{studentId}/ca-marks
     */
    @GetMapping("/students/{studentId}/ca-marks")
    public ResponseEntity<List<Map<String, Object>>>
            getStudentCAMarks(
                    @PathVariable String studentId) {

        List<CAMarks> marks =
                caMarksService.getCAMarksByStudentId(studentId);

        return ResponseEntity.ok(convertCAMarks(marks));
    }

    /**
     * Converts CA entities into a safe API response.
     *
     * CA number is deliberately excluded because the project
     * now has only one CA per student, subject and semester.
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