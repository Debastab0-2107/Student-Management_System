package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.Faculty;

/**
 * FacultyDao
 *
 * Defines database-level operations for Faculty records.
 *
 * The DAO layer communicates with Hibernate and does not contain
 * controller-level or HTTP-related logic.
 *
 * Faculty records are never physically deleted.
 * Deactivation is performed by changing the status field to false.
 */
public interface FacultyDao {

    /**
     * Saves a new Faculty record.
     *
     * @param faculty faculty object to save
     * @return saved faculty object
     */
    Faculty save(Faculty faculty);

    /**
     * Finds a faculty member using the teacher ID.
     *
     * @param teacherId unique faculty identifier
     * @return faculty if found, otherwise null
     */
    Faculty findById(String teacherId);

    /**
     * Checks whether a faculty member already exists.
     *
     * @param teacherId unique faculty identifier
     * @return true if the faculty exists
     */
    boolean existsById(String teacherId);

    /**
     * Retrieves all faculty records.
     *
     * This includes both active and inactive records because
     * inactive records are retained for historical purposes.
     *
     * @return list of all faculty records
     */
    List<Faculty> findAll();

    /**
     * Updates an existing faculty record.
     *
     * @param faculty updated faculty information
     * @return true if updated successfully
     */
    boolean update(Faculty faculty);

    /**
     * Deactivates a faculty member.
     *
     * This does NOT physically delete the database row.
     * It changes status from true to false.
     *
     * @param teacherId faculty identifier
     * @return true if deactivated successfully
     */
    boolean deactivateById(String teacherId);
}