package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

/**
 * FacultyServiceImpl
 *
 * Implements business logic for Faculty management.
 *
 * Architecture:
 *
 * Controller
 *     ↓
 * FacultyService
 *     ↓
 * FacultyServiceImpl
 *     ↓
 * FacultyDao
 *     ↓
 * Hibernate
 */
@Service
public class FacultyServiceImpl implements FacultyService {

    private final FacultyDao facultyDao;

    /**
     * Constructor-based dependency injection.
     *
     * @param facultyDao faculty DAO
     */
    public FacultyServiceImpl(FacultyDao facultyDao) {
        this.facultyDao = facultyDao;
    }

    /**
     * Saves a new faculty record.
     *
     * Duplicate teacher IDs are rejected.
     *
     * @param faculty faculty to save
     * @return saved faculty
     */
    @Override
    public Faculty save(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException(
                    "Faculty cannot be null");
        }

        if (faculty.getTeacherId() == null
                || faculty.getTeacherId().isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        if (faculty.getName() == null
                || faculty.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Faculty name is required");
        }

        if (faculty.getFacultyType() == null
                || faculty.getFacultyType().isBlank()) {
            throw new IllegalArgumentException(
                    "Faculty type is required");
        }

        if (facultyDao.existsById(
                faculty.getTeacherId())) {

            throw new IllegalArgumentException(
                    "Faculty already exists with teacher ID: "
                            + faculty.getTeacherId());
        }

        return facultyDao.save(faculty);
    }

    /**
     * Finds faculty by teacher ID.
     *
     * @param teacherId faculty identifier
     * @return faculty if found
     */
    @Override
    public Faculty findById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        return facultyDao.findById(teacherId);
    }

    /**
     * Checks whether a faculty member exists.
     *
     * @param teacherId faculty identifier
     * @return true if exists
     */
    @Override
    public boolean existsById(String teacherId) {

        return facultyDao.existsById(teacherId);
    }

    /**
     * Retrieves all faculty records.
     *
     * @return all faculty records
     */
    @Override
    public List<Faculty> findAll() {

        return facultyDao.findAll();
    }

    /**
     * Updates an existing faculty record.
     *
     * @param faculty updated faculty
     * @return true if updated
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

    /**
     * Deactivates a faculty member.
     *
     * No physical database deletion occurs.
     *
     * @param teacherId faculty identifier
     * @return true if deactivated
     */
    @Override
    public boolean deactivateById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        return facultyDao.deactivateById(teacherId);
    }
}