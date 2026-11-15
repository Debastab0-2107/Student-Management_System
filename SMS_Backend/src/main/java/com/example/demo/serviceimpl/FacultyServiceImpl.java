
package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;
import com.example.demo.service.FacultyService;

/**
 * FacultyServiceImpl
 *
 * Implements business logic for Faculty management.
 *
 * Automatically creates login credentials whenever a new
 * Permanent or Visiting Faculty member is saved.
 */
@Service
public class FacultyServiceImpl implements FacultyService {

    private final FacultyDao facultyDao;
    private final PasswordEncoder passwordEncoder;

    private static final String PERMANENT_DEFAULT_PASSWORD =
            "permanentfaculty@2026";

    private static final String VISITING_DEFAULT_PASSWORD =
            "visitingfaculty@2026";

    /**
     * Constructor-based dependency injection.
     */
    public FacultyServiceImpl(
            FacultyDao facultyDao,
            PasswordEncoder passwordEncoder) {

        this.facultyDao = facultyDao;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Saves a new faculty record and automatically creates
     * the corresponding login credentials.
     *
     * REGULAR  = Permanent Faculty
     * VISITING = Visiting Faculty
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

        if (facultyDao.existsById(faculty.getTeacherId())) {

            throw new IllegalArgumentException(
                    "Faculty already exists with teacher ID: "
                            + faculty.getTeacherId());
        }

        String defaultPassword;

        String facultyType =
                faculty.getFacultyType().trim();

        if ("REGULAR".equalsIgnoreCase(facultyType)) {

            defaultPassword = PERMANENT_DEFAULT_PASSWORD;

        } else if ("VISITING".equalsIgnoreCase(facultyType)) {

            defaultPassword = VISITING_DEFAULT_PASSWORD;

        } else {

            throw new IllegalArgumentException(
                    "Invalid faculty type. "
                    + "Only REGULAR and VISITING are allowed.");
        }

        // Hash the default password using the existing
        // Spring Security PasswordEncoder (BCrypt).
        String passwordHash =
                passwordEncoder.encode(defaultPassword);

        // Save faculty and credentials together.
        // The DAO method handles the database transaction.
        return facultyDao.saveWithCredentials(
                faculty,
                passwordHash);
    }

    /**
     * Finds faculty by teacher ID.
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
     */
    @Override
    public boolean existsById(String teacherId) {

        return facultyDao.existsById(teacherId);
    }

    /**
     * Retrieves all faculty records.
     */
    @Override
    public List<Faculty> findAll() {

        return facultyDao.findAll();
    }

    /**
     * Updates an existing faculty record.
     *
     * Only Visiting Faculty can be updated through this endpoint.
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

        Faculty existingFaculty =
                facultyDao.findById(faculty.getTeacherId());

        if (existingFaculty == null) {
            return false;
        }

        if (!"VISITING".equalsIgnoreCase(
                existingFaculty.getFacultyType())) {

            throw new IllegalArgumentException(
                    "Only visiting faculty can be updated "
                    + "through this endpoint");
        }

        if (faculty.getName() == null
                || faculty.getName().isBlank()) {

            throw new IllegalArgumentException(
                    "Faculty name is required");
        }

        faculty.setFacultyType("VISITING");
        faculty.setStatus(existingFaculty.isStatus());

        return facultyDao.update(faculty);
    }

    /**
     * Deactivates a faculty member.
     *
     * No physical database deletion occurs.
     */
    @Override
    public boolean deactivateById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        return facultyDao.deactivateById(teacherId);
    }

    /**
     * Updates the editable profile information of a faculty member.
     */
    @Override
    public boolean updateProfile(
            String teacherId,
            String phoneNumber,
            String alternatePhoneNumber,
            String email,
            String educationalDetails) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID is required");
        }

        Faculty existingFaculty =
                facultyDao.findById(teacherId);

        if (existingFaculty == null) {
            return false;
        }

        if (!existingFaculty.isStatus()) {
            throw new IllegalArgumentException(
                    "Inactive faculty cannot update their profile");
        }

        if (phoneNumber != null && !phoneNumber.isBlank()
                && !phoneNumber.matches("[0-9+\\-\\s]{7,20}")) {

            throw new IllegalArgumentException(
                    "Please enter a valid primary mobile number");
        }

        if (alternatePhoneNumber != null
                && !alternatePhoneNumber.isBlank()
                && !alternatePhoneNumber.matches("[0-9+\\-\\s]{7,20}")) {

            throw new IllegalArgumentException(
                    "Please enter a valid alternative mobile number");
        }

        if (email != null && !email.isBlank()
                && !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {

            throw new IllegalArgumentException(
                    "Please enter a valid email address");
        }

        return facultyDao.updateProfile(
                teacherId,
                phoneNumber,
                alternatePhoneNumber,
                email,
                educationalDetails);
    }
}
