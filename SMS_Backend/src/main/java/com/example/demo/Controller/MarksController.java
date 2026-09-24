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

import com.example.demo.model.Marks;
import com.example.demo.service.MarksService;

/**
 * REST controller responsible for Marks management operations.
 *
 * This controller receives HTTP requests and delegates business
 * processing to the MarksService layer.
 */
@RestController
@RequestMapping("/marks")
public class MarksController {

    /** Service used for Marks business operations. */
    private final MarksService marksService;

    /**
     * Creates the MarksController with the required service.
     *
     * @param marksService Marks business service
     */
    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    /**
     * Creates a new marks record.
     *
     * @param marks marks information received from the client
     * @return the created marks record
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
     * Retrieves a marks record by its identifier.
     *
     * @param marksId unique marks record identifier
     * @return the requested marks record
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
     *
     * @return list of all marks records
     */
    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {

        return ResponseEntity.ok(
                marksService.getAllMarks());
    }

    /**
     * Updates an existing marks record.
     *
     * @param marksId identifier of the marks record to update
     * @param marks updated marks information
     * @return HTTP response indicating whether the update succeeded
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
     * Deletes a marks record by its identifier.
     *
     * @param marksId unique marks record identifier
     * @return HTTP response indicating whether deletion succeeded
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
}