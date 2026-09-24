package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.SubjectDao;
import com.example.demo.exception.FileValidationException;
import com.example.demo.model.Subject;
import com.example.demo.service.SubjectService;

/**
 * Implements the business operations for Subject management.
 *
 * This class acts as the business layer between the SubjectController
 * and SubjectDao. It performs input validation before delegating
 * database operations to the DAO layer.
 */
@Service
public class SubjectServiceImpl implements SubjectService {

    /** Data-access object used for Subject database operations. */
    private final SubjectDao subjectDao;

    /**
     * Creates the SubjectServiceImpl with the required SubjectDao.
     *
     * @param subjectDao Subject data-access object
     */
    public SubjectServiceImpl(SubjectDao subjectDao) {
        this.subjectDao = subjectDao;
    }

    /**
     * Creates and saves a new subject.
     *
     * @param subject subject details to save
     * @return the saved subject
     */
    @Override
    public Subject createSubject(Subject subject) {

        validateSubject(subject);

        if (subjectDao.findById(subject.getSubjectId()) != null) {
            throw new IllegalArgumentException(
                    "Subject already exists: " + subject.getSubjectId());
        }

        return subjectDao.save(subject);
    }

    /**
     * Retrieves a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return the matching subject, or null if not found
     */
    @Override
    public Subject getSubjectById(String subjectId) {

        validateSubjectId(subjectId);

        return subjectDao.findById(subjectId);
    }

    /**
     * Retrieves all subjects.
     *
     * @return list of all subjects
     */
    @Override
    public List<Subject> getAllSubjects() {
        return subjectDao.findAll();
    }

    /**
     * Updates an existing subject.
     *
     * @param subject subject containing updated details
     * @return true if the subject was successfully updated
     */
    @Override
    public boolean updateSubject(Subject subject) {

        validateSubject(subject);

        return subjectDao.update(subject);
    }

    /**
     * Deletes a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return true if the subject was successfully deleted
     */
    @Override
    public boolean deleteSubject(String subjectId) {

        validateSubjectId(subjectId);

        return subjectDao.deleteById(subjectId);
    }

    /**
     * Validates a Subject object before database operations.
     *
     * @param subject subject object to validate
     */
    private void validateSubject(Subject subject) {

        if (subject == null) {
            throw new FileValidationException(
                    "Subject data must not be null.");
        }

        if (subject.getSubjectId() == null
                || subject.getSubjectId().isBlank()) {
            throw new IllegalArgumentException(
                    "Subject ID must not be empty.");
        }

        if (subject.getSubjectName() == null
                || subject.getSubjectName().isBlank()) {
            throw new IllegalArgumentException(
                    "Subject name must not be empty.");
        }
    }

    /**
     * Validates a Subject identifier.
     *
     * @param subjectId subject identifier to validate
     */
    private void validateSubjectId(String subjectId) {

        if (subjectId == null || subjectId.isBlank()) {
            throw new IllegalArgumentException(
                    "Subject ID must not be empty.");
        }
    }
}