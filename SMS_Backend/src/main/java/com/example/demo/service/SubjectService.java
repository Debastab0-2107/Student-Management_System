package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Subject;

/**
 * Defines the business operations available for Subject management.
 *
 * This interface separates the Subject business layer from the
 * controller and data-access layers.
 */
public interface SubjectService {

    /**
     * Creates and saves a new subject.
     *
     * @param subject subject details to save
     * @return the saved subject
     */
    Subject createSubject(Subject subject);

    /**
     * Retrieves a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return the matching subject, or null if not found
     */
    Subject getSubjectById(String subjectId);

    /**
     * Retrieves all subjects.
     *
     * @return list of all subjects
     */
    List<Subject> getAllSubjects();

    /**
     * Updates an existing subject.
     *
     * @param subject subject containing updated details
     * @return true if the subject was successfully updated
     */
    boolean updateSubject(Subject subject);

    /**
     * Deletes a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return true if the subject was successfully deleted
     */
    boolean deleteSubject(String subjectId);
}