package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.MarksDao;
import com.example.demo.model.Marks;
import com.example.demo.service.MarksService;

/**
 * Implements the business operations for Marks management.
 *
 * This class acts as the business layer between the MarksController
 * and MarksDao. It performs basic input validation before delegating
 * database operations to the DAO layer.
 */
@Service
public class MarksServiceImpl implements MarksService {

    /** Data-access object used for Marks database operations. */
    private final MarksDao marksDao;

    /**
     * Creates the MarksServiceImpl with the required MarksDao.
     *
     * @param marksDao Marks data-access object
     */
    public MarksServiceImpl(MarksDao marksDao) {
        this.marksDao = marksDao;
    }

    /**
     * Creates and saves a new marks record.
     *
     * @param marks marks details to save
     * @return the saved marks record
     */
    @Override
    public Marks createMarks(Marks marks) {

        validateMarks(marks);

        if (marksDao.findById(marks.getMarksId()) != null) {
            throw new IllegalArgumentException(
                    "Marks record already exists: " + marks.getMarksId());
        }

        return marksDao.save(marks);
    }

    /**
     * Retrieves a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return the matching marks record, or null if not found
     */
    @Override
    public Marks getMarksById(String marksId) {

        validateMarksId(marksId);

        return marksDao.findById(marksId);
    }

    /**
     * Retrieves all marks records.
     *
     * @return list of all marks records
     */
    @Override
    public List<Marks> getAllMarks() {
        return marksDao.findAll();
    }

    /**
     * Updates an existing marks record.
     *
     * @param marks marks containing updated details
     * @return true if the marks record was successfully updated
     */
    @Override
    public boolean updateMarks(Marks marks) {

        validateMarks(marks);

        return marksDao.update(marks);
    }

    /**
     * Deletes a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return true if the marks record was successfully deleted
     */
    @Override
    public boolean deleteMarks(String marksId) {

        validateMarksId(marksId);

        return marksDao.deleteById(marksId);
    }

    /**
     * Validates a Marks object before database operations.
     *
     * @param marks marks object to validate
     */
    private void validateMarks(Marks marks) {

        if (marks == null) {
            throw new IllegalArgumentException(
                    "Marks data must not be null.");
        }

        if (marks.getMarksId() == null
                || marks.getMarksId().isBlank()) {
            throw new IllegalArgumentException(
                    "Marks ID must not be empty.");
        }

        if (marks.getStudentId() == null
                || marks.getStudentId().isBlank()) {
            throw new IllegalArgumentException(
                    "Student ID must not be empty.");
        }

        if (marks.getSubjectId() == null
                || marks.getSubjectId().isBlank()) {
            throw new IllegalArgumentException(
                    "Subject ID must not be empty.");
        }

        if (marks.getMarks() == null) {
            throw new IllegalArgumentException(
                    "Marks value must not be null.");
        }
    }

    /**
     * Validates a Marks identifier.
     *
     * @param marksId marks identifier to validate
     */
    private void validateMarksId(String marksId) {

        if (marksId == null || marksId.isBlank()) {
            throw new IllegalArgumentException(
                    "Marks ID must not be empty.");
        }
    }
}