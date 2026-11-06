package com.example.demo.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.response.FacultyStudentResponse;
import com.example.demo.service.FacultyStudentService;

@RestController
@RequestMapping("/faculty")
public class FacultyStudentController {

    private final FacultyStudentService facultyStudentService;

    public FacultyStudentController(
            FacultyStudentService facultyStudentService) {

        this.facultyStudentService = facultyStudentService;
    }

    @GetMapping("/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<FacultyStudentResponse>>
            getAllStudents() {

        List<FacultyStudentResponse> students =
                facultyStudentService.getAllStudents();

        return ResponseEntity.ok(students);
    }
}