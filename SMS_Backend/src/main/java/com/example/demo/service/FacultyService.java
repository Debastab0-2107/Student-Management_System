package com.example.demo.service;

import com.example.demo.model.Faculty;

import java.util.List;

/*
 * FacultyService defines the service-layer operations related to Faculty.
 *
 * This interface acts as a contract between the Controller layer and
 * the Service Implementation layer.
 *
 * The service layer is responsible for handling Faculty-related
 * application operations and delegating data-access work to the DAO layer.
 *
 * The actual implementation of these methods is provided by
 * FacultyServiceImpl in the service.impl package.
 */
public interface FacultyService {

    /*
     * Saves a new Faculty record.
     *
     * @param faculty Faculty object containing the data to be saved.
     * @return the saved Faculty object.
     */
    Faculty save(Faculty faculty);

    /*
     * Finds a Faculty member using the teacher ID.
     *
     * @param teacherId unique ID of the faculty member.
     * @return the matching Faculty object.
     */
    Faculty findById(String teacherId);

    /*
     * Retrieves all Faculty records.
     *
     * @return a List containing all Faculty objects.
     */
    List<Faculty> findAll();

    /*
     * Updates an existing Faculty record.
     *
     * @param faculty Faculty object containing the updated information.
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