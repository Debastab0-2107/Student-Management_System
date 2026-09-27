package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.Student;

/**
 * StudentDao
 *
 * Data Access Object interface for Student operations.
 *
 * This interface defines the database operations required by the
 * Student Management System.
 *
 * The DAO is responsible only for database-level operations.
 * Business rules such as password verification and deciding which
 * fields a student is allowed to change belong to the Service layer.
 *
 * Student authority-controlled fields:
 * - studentId
 * - name
 * - phoneNumber
 * - courseId
 * - sessionId
 *
 * Student-editable fields:
 * - email
 * - dateOfBirth
 * - fatherName
 * - fatherPhoneNumber
 * - motherName
 * - motherPhoneNumber
 * - password
 */
public interface StudentDao {

    /**
     * Saves a new student record in the database.
     *
     * This operation is primarily used when the department admin
     * imports students from the authority-provided Excel sheet.
     *
     * @param student student object to save
     * @return the saved student
     */
    Student save(Student student);

    /**
     * Finds a student using the authority-assigned student ID.
     *
     * The student ID is the primary identifier used during
     * student authentication.
     *
     * @param studentId authority-assigned student ID
     * @return matching student, or null if no student exists
     */
    Student findByStudentId(String studentId);

    /**
     * Checks whether a student already exists with the supplied
     * student ID.
     *
     * This is used during Excel import to prevent duplicate
     * student records.
     *
     * @param studentId authority-assigned student ID
     * @return true if the student exists, otherwise false
     */
    boolean existsByStudentId(String studentId);

    /**
     * Retrieves all students.
     *
     * This operation can be used by administrative functionality
     * such as viewing imported student records.
     *
     * @return list of all students
     */
    List<Student> findAll();

    /**
     * Updates only the fields that a student is permitted to edit.
     *
     * Authority-controlled fields are deliberately not parameters
     * of this method. Therefore this DAO operation cannot accidentally
     * modify the student's ID, name, phone number, course, or session.
     *
     * @param studentId authority-assigned student ID
     * @param email student's email address
     * @param dateOfBirth student's date of birth
     * @param fatherName father's name
     * @param fatherPhoneNumber father's phone number
     * @param motherName mother's name
     * @param motherPhoneNumber mother's phone number
     * @return true if the update was successful, otherwise false
     */
    boolean updateStudentProfile(
            String studentId,
            String email,
            String dateOfBirth,
            String fatherName,
            String fatherPhoneNumber,
            String motherName,
            String motherPhoneNumber);

    /**
     * Updates the student's password hash.
     *
     * The DAO receives only the BCrypt hash.
     * The plain-text password must never be stored in the database.
     *
     * @param studentId authority-assigned student ID
     * @param passwordHash BCrypt password hash
     * @param mustChangePassword indicates whether the student must
     *                           change the initial password
     * @return true if the update was successful, otherwise false
     */
    boolean updatePassword(
            String studentId,
            String passwordHash,
            boolean mustChangePassword);
}