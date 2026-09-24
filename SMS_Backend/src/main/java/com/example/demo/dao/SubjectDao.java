package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.Subject;

/**
 * Defines the data-access operations for Subject entities.
 *
 * The implementation of this interface is responsible for communicating
 * with the database through native Hibernate.
 */
public interface SubjectDao {

    /**
     * Saves a new subject in the database.
     *
     * @param subject subject object to save
     * @return the saved subject
     */
    Subject save(Subject subject);

    /**
     * Finds a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return the matching subject, or null if not found
     */
    Subject findById(String subjectId);

    /**
     * Retrieves all subjects from the database.
     *
     * @return list of all subjects
     */
    List<Subject> findAll();

    /**
     * Updates an existing subject.
     *
     * @param subject subject object containing updated information
     * @return true if the subject was updated successfully
     */
    boolean update(Subject subject);

    /**
     * Deletes a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return true if the subject was deleted successfully
     */
    boolean deleteById(String subjectId);
}