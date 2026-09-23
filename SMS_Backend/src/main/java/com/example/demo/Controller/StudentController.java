package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;

/**
 * REST controller responsible for handling student-related HTTP requests.
 *
 * This controller receives requests from the client and delegates student
 * operations to the StudentService layer.
 *
 * Architecture flow:
 * Controller -> Service -> DAO -> Hibernate -> MySQL
 */
@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;

    /**
     * Constructor-based dependency injection for StudentService.
     *
     * @param studentService service responsible for student operations
     */
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * Retrieves a student using the student's unique ID.
     *
     * @param studentId unique student ID
     * @return the student record if found
     */
    @GetMapping("/{studentId}")
    public ResponseEntity<Student> findByStudentId(
            @PathVariable String studentId) {

        Student student = studentService.findByStudentId(studentId);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(student);
    }
}