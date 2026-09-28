package com.example.demo.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Student;

/**
 * AdminService
 *
 * Defines business operations available to the department administrator.
 *
 * Current responsibilities:
 *
 * 1. Import students from the authority Excel file.
 * 2. Import regular/permanent faculty from the authority Excel file.
 * 3. Deactivate regular/permanent faculty using the authority
 *    deactivation Excel file.
 *
 * Visiting faculty are managed directly through the FacultyController
 * using authenticated Admin requests.
 *
 * Architecture:
 *
 * AdminController
 *       ↓
 * AdminService
 *       ↓
 * StudentService / FacultyService
 *       ↓
 * DAO
 *       ↓
 * Hibernate
 *       ↓
 * MySQL
 */
public interface AdminService {

    /**
     * Imports student records from an authority-provided Excel file.
     *
     * Expected student Excel columns:
     *
     * studentId | name | phoneNumber | courseId | sessionId
     *
     * @param file authority-provided student Excel file
     * @return list of successfully imported students
     */
    List<Student> importStudentsFromExcel(MultipartFile file);

    /**
     * Imports regular/permanent faculty from the authority Excel file.
     *
     * Expected columns:
     *
     * teacherId | name | phoneNumber | facultyType | deptId
     *
     * The facultyType must be REGULAR.
     *
     * @param file authority-provided regular faculty Excel file
     * @return number of successfully imported faculty records
     */
    int importRegularFacultyFromExcel(MultipartFile file);

    /**
     * Deactivates regular/permanent faculty using an authority-provided
     * deactivation Excel file.
     *
     * Expected column:
     *
     * teacherId
     *
     * Faculty records are NOT physically deleted.
     * Their status is changed to false.
     *
     * @param file authority-provided faculty deactivation Excel file
     * @return number of successfully deactivated faculty records
     */
    int deactivateRegularFacultyFromExcel(MultipartFile file);
}