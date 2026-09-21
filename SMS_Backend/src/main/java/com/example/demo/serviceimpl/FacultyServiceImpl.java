package com.example.demo.serviceimpl;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

import java.util.List;

/*
 * FacultyServiceImpl provides the implementation of the FacultyService interface.
 *
 * This class belongs to the Service Implementation layer.
 * It receives Faculty-related operations from the Controller layer
 * and delegates the required data-access operations to FacultyDao.
 *
 * The service layer acts as an intermediate layer between the
 * Controller and DAO layers.
 */
public class FacultyServiceImpl implements FacultyService {

    /*
     * Reference to the FacultyDao.
     *
     * This object is used to delegate database-related Faculty
     * operations to the DAO layer.
     */
    private FacultyDao facultyDao;


    /*
     * Saves a new Faculty record.
     *
     * The Faculty object is passed to the DAO layer, where the
     * actual data-access operation will be performed.
     *
     * @param faculty Faculty object containing the data to be saved.
     * @return the saved Faculty object.
     */
    @Override
    public Faculty save(Faculty faculty) {

        return facultyDao.save(faculty);
    }


    /*
     * Finds a Faculty member using the teacher ID.
     *
     * The teacher ID is passed to the DAO layer to retrieve
     * the corresponding Faculty record.
     *
     * @param teacherId unique ID of the faculty member.
     * @return the matching Faculty object.
     */
    @Override
    public Faculty findById(String teacherId) {

        return facultyDao.findById(teacherId);
    }


    /*
     * Retrieves all Faculty records.
     *
     * The request is delegated to the DAO layer, which will
     * perform the actual data-access operation.
     *
     * @return a List containing all Faculty objects.
     */
    @Override
    public List<Faculty> findAll() {

        return facultyDao.findAll();
    }


    /*
     * Updates an existing Faculty record.
     *
     * The Faculty object containing the updated information
     * is passed to the DAO layer for processing.
     *
     * @param faculty Faculty object containing the updated information.
     * @return true if the update is successful, otherwise false.
     */
    @Override
    public boolean update(Faculty faculty) {

        return facultyDao.update(faculty);
    }


    /*
     * Deletes a Faculty record using the teacher ID.
     *
     * The teacher ID is passed to the DAO layer, which will
     * perform the actual deletion operation.
     *
     * @param teacherId unique ID of the faculty member to be deleted.
     * @return true if the deletion is successful, otherwise false.
     */
    @Override
    public boolean deleteById(String teacherId) {

        return facultyDao.deleteById(teacherId);
    }

}