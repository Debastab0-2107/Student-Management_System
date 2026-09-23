package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

/*
 * FacultyServiceImpl
 * ------------------
 * Contains the business/service layer logic
 * for Faculty operations.
 *
 * Controller
 *     ↓
 * FacultyService
 *     ↓
 * FacultyServiceImpl
 *     ↓
 * FacultyDao
 */
@Service
public class FacultyServiceImpl implements FacultyService {

    private final FacultyDao facultyDao;

    public FacultyServiceImpl(FacultyDao facultyDao) {
        this.facultyDao = facultyDao;
    }

    /*
     * Creates a new faculty record.
     */
    @Override
    public Faculty save(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException(
                    "Faculty cannot be null");
        }

        return facultyDao.save(faculty);
    }

    /*
     * Finds a faculty member by teacher ID.
     */
    @Override
    public Faculty findById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        return facultyDao.findById(teacherId);
    }

    /*
     * Retrieves all faculty records.
     */
    @Override
    public List<Faculty> findAll() {

        return facultyDao.findAll();
    }

    /*
     * Updates an existing faculty record.
     */
    @Override
    public boolean update(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException(
                    "Faculty cannot be null");
        }

        if (faculty.getTeacherId() == null
                || faculty.getTeacherId().isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        return facultyDao.update(faculty);
    }

    /*
     * Deletes a faculty record by teacher ID.
     */
    @Override
    public boolean deleteById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        return facultyDao.deleteById(teacherId);
    }
}