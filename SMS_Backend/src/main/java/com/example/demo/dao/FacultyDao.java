package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.Faculty;

/*
 * FacultyDao defines the Data Access Object (DAO) operations
 * related to the Faculty model.
 *
 * This interface provides the contract for performing
 * database-related operations on Faculty data.
 *
 * The actual database implementation will be provided by
 * FacultyDaoImpl in the dao.impl package.
 */
public interface FacultyDao {

    /*
     * Saves a new Faculty object to the database.
     *
     * @param faculty Faculty object containing the data to be saved.
     * @return the saved Faculty object.
     */
    Faculty save(Faculty faculty);

    /*
     * Finds a Faculty member using the teacher ID.
     *
     * @param teacherId unique ID of the faculty member.
     * @return the matching Faculty object, if found.
     */
    Faculty findById(String teacherId);

    /*
     * Retrieves all Faculty records from the database.
     *
     * @return a List containing all Faculty objects.
     */
    List<Faculty> findAll();

    /*
     * Updates the existing Faculty information.
     *
     * @param faculty Faculty object containing the updated data.
     * @return true if the update is successful, otherwise false.
     */
    boolean update(Faculty faculty);

    /*
     * Deletes a Faculty record using the teacher ID.
     *
     * @param teacherId unique ID of the faculty member to be deleted.
     * @return true if the deletion is successful, otherwise false.
     */
    boolean deleteById(String teacherId);

}