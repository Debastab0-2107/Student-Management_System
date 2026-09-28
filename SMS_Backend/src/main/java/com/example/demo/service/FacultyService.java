package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Faculty;

/**
 * FacultyService
 *
 * Defines business operations related to Faculty management.
 *
 * Faculty management is performed by the administrator.
 *
 * Regular faculty:
 * - Added through authority Excel import.
 * - Deactivated through authority Excel.
 *
 * Visiting faculty:
 * - Added directly by Admin.
 * - Deactivated directly by Admin.
 */
public interface FacultyService {

    /**
     * Saves a new faculty record.
     *
     * @param faculty faculty to save
     * @return saved faculty
     */
    Faculty save(Faculty faculty);

    /**
     * Finds faculty by teacher ID.
     *
     * @param teacherId faculty identifier
     * @return faculty if found
     */
    Faculty findById(String teacherId);

    /**
     * Checks whether a faculty member exists.
     *
     * @param teacherId faculty identifier
     * @return true if exists
     */
    boolean existsById(String teacherId);

    /**
     * Retrieves all faculty records.
     *
     * @return all faculty records
     */
    List<Faculty> findAll();

    /**
     * Updates faculty information.
     *
     * @param faculty updated faculty
     * @return true if successful
     */
    boolean update(Faculty faculty);

    /**
     * Deactivates faculty.
     *
     * This performs a soft delete by setting status to false.
     *
     * @param teacherId faculty identifier
     * @return true if successful
     */
    boolean deactivateById(String teacherId);
}