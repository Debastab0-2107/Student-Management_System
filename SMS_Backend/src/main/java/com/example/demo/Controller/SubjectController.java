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

import com.example.demo.model.Subject;
import com.example.demo.service.SubjectService;

/**
 * REST controller responsible for Subject management operations.
 *
 * This controller receives HTTP requests and delegates business
 * processing to the SubjectService layer.
 */
@RestController
@RequestMapping("/subject")
public class SubjectController {

    /** Service used for Subject business operations. */
    private final SubjectService subjectService;

    /**
     * Creates the SubjectController with the required service.
     *
     * @param subjectService Subject business service
     */
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    /**
     * Creates a new subject.
     *
     * @param subject subject information received from the client
     * @return the created subject
     */
    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @RequestBody Subject subject) {

        Subject createdSubject = subjectService.createSubject(subject);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSubject);
    }

    /**
     * Retrieves a subject by its identifier.
     *
     * @param subjectId unique subject identifier
     * @return the requested subject
     */
    @GetMapping("/{subjectId}")
    public ResponseEntity<Subject> getSubjectById(
            @PathVariable String subjectId) {

        Subject subject = subjectService.getSubjectById(subjectId);

        if (subject == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(subject);
    }

    /**
     * Retrieves all subjects.
     *
     * @return list of all subjects
     */
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {

        return ResponseEntity.ok(
                subjectService.getAllSubjects());
    }

    /**
     * Updates an existing subject.
     *
     * @param subject updated subject information
     * @param subjectId identifier of the subject to update
     * @return HTTP response indicating whether the update succeeded
     */
    @PutMapping("/{subjectId}")
    public ResponseEntity<String> updateSubject(
            @PathVariable String subjectId,
            @RequestBody Subject subject) {

        subject.setSubjectId(subjectId);

        boolean updated = subjectService.updateSubject(subject);

        if (!updated) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Subject not found.");
        }

        return ResponseEntity.ok("Subject updated successfully.");
    }

    /**
     * Deletes a subject by its identifier.
     *
     * @param subjectId unique subject identifier
     * @return HTTP response indicating whether deletion succeeded
     */
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<String> deleteSubject(
            @PathVariable String subjectId) {

        boolean deleted = subjectService.deleteSubject(subjectId);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Subject not found.");
        }

        return ResponseEntity.ok("Subject deleted successfully.");
    }
}