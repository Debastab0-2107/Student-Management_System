package com.example.demo.Controller;

import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

import java.util.List;

/*
 * FacultyController handles Faculty-related operations at the
 * Controller layer of the Student Management System.
 *
 * This class receives Faculty-related requests and delegates
 * the actual processing to FacultyService.
 *
 * The Controller does not directly communicate with the DAO layer.
 * The request flow is:
 *
 * Controller → Service → DAO
 */
public class FacultyController {

    /*
     * Reference to FacultyService.
     *
     * This service is used to perform Faculty-related operations
     * through the Service layer.
     */
    private FacultyService facultyService;

    /*
     * Saves a new Faculty record.
     *
     * @param faculty Faculty object containing the data to be saved.
     * @return the saved Faculty object.
     */
    public Faculty save(Faculty faculty) {

        return facultyService.save(faculty);
    }

    /*
     * Finds a Faculty member using the teacher ID.
     *
     * @param teacherId unique ID of the faculty member.
     * @return the matching Faculty object.
     */
    public Faculty findById(String teacherId) {

        return facultyService.findById(teacherId);
    }

    /*
     * Retrieves all Faculty records.
     *
     * @return a List containing all Faculty objects.
     */
    public List<Faculty> findAll() {

        return facultyService.findAll();
    }

    /*
     * Updates an existing Faculty record.
     *
     * @param faculty Faculty object containing the updated information.
     * @return true if the update is successful, otherwise false.
     */
    public boolean update(Faculty faculty) {

        return facultyService.update(faculty);
    }

    /*
     * Deletes a Faculty record using the teacher ID.
     *
     * @param teacherId unique ID of the faculty member to be deleted.
     * @return true if the deletion is successful, otherwise false.
     */
    public boolean deleteById(String teacherId) {

        return facultyService.deleteById(teacherId);
    }

}