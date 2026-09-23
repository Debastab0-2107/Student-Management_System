package com.example.demo.Controller;

import java.util.List;

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
 * REST controller responsible for handling faculty-related HTTP requests.
 *
 * This controller receives requests from the client and delegates the
 * business operations to the FacultyService layer.
 *
 * Architecture flow:
 * Controller -> Service -> DAO -> Hibernate -> MySQL
 *
 * Faculty and visiting faculty are handled by the same Faculty model.
 * The facultyType field distinguishes between the two types.
 */
@RestController
@RequestMapping("/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    /**
     * Constructor-based dependency injection for FacultyService.
     *
     * @param facultyService service responsible for faculty operations
     */
    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    /**
     * Creates a new faculty record.
     *
     * @param faculty faculty information received from the request body
     * @return the saved faculty record
     */
    @PostMapping
    public ResponseEntity<Faculty> save(
            @RequestBody Faculty faculty) {

        Faculty savedFaculty = facultyService.save(faculty);

        return ResponseEntity.ok(savedFaculty);
    }

    /**
     * Retrieves a faculty member using the teacher ID.
     *
     * @param teacherId unique teacher ID
     * @return the faculty record if found
     */
    @GetMapping("/{teacherId}")
    public ResponseEntity<Faculty> findById(
            @PathVariable String teacherId) {

        Faculty faculty = facultyService.findById(teacherId);

        if (faculty == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(faculty);
    }

    /**
     * Retrieves all faculty records.
     *
     * @return list containing all faculty members
     */
    @GetMapping
    public ResponseEntity<List<Faculty>> findAll() {

        List<Faculty> facultyList = facultyService.findAll();

        return ResponseEntity.ok(facultyList);
    }

    /**
     * Updates an existing faculty record.
     *
     * @param faculty updated faculty information
     * @return success response when the faculty is updated
     */
    @PutMapping
    public ResponseEntity<Void> update(
            @RequestBody Faculty faculty) {

        boolean updated = facultyService.update(faculty);

        if (!updated) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Deletes a faculty member using the teacher ID.
     *
     * @param teacherId unique teacher ID of the faculty member
     * @return success response when the record is deleted
     */
    @DeleteMapping("/{teacherId}")
    public ResponseEntity<Void> deleteById(
            @PathVariable String teacherId) {

        boolean deleted = facultyService.deleteById(teacherId);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}