package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Marks;

/**
 * Defines the business operations available for Marks management.
 *
 * This interface separates the Marks business layer from the
 * controller and data-access layers.
 */
public interface MarksService {

    /**
     * Creates and saves a new marks record.
     *
     * @param marks marks details to save
     * @return the saved marks record
     */
    Marks createMarks(Marks marks);

    /**
     * Retrieves a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return the matching marks record, or null if not found
     */
    Marks getMarksById(String marksId);

    /**
     * Retrieves all marks records.
     *
     * @return list of all marks records
     */
    List<Marks> getAllMarks();

    /**
     * Updates an existing marks record.
     *
     * @param marks marks containing updated details
     * @return true if the marks record was successfully updated
     */
    boolean updateMarks(Marks marks);

    /**
     * Deletes a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return true if the marks record was successfully deleted
     */
    boolean deleteMarks(String marksId);
}