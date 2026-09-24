package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.Marks;

/**
 * Defines the data-access operations for Marks entities.
 *
 * The implementation of this interface is responsible for communicating
 * with the database through native Hibernate.
 */
public interface MarksDao {

    /**
     * Saves a new marks record in the database.
     *
     * @param marks marks object to save
     * @return the saved marks object
     */
    Marks save(Marks marks);

    /**
     * Finds a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return the matching marks record, or null if not found
     */
    Marks findById(String marksId);

    /**
     * Retrieves all marks records from the database.
     *
     * @return list of all marks records
     */
    List<Marks> findAll();

    /**
     * Updates an existing marks record.
     *
     * @param marks marks object containing updated information
     * @return true if the marks record was updated successfully
     */
    boolean update(Marks marks);

    /**
     * Deletes a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return true if the marks record was deleted successfully
     */
    boolean deleteById(String marksId);
}