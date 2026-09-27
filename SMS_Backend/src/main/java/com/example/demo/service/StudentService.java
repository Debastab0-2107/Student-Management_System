package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Student;

/**
 * StudentService
 *
 * Service-layer interface for student-related business operations.
 *
 * The service layer sits between the Controller and DAO layers.
 *
 * Controller
 *     ↓
 * StudentService
 *     ↓
 * StudentDao
 *     ↓
 * Hibernate / MySQL
 *
 * This interface separates student business rules from database
 * implementation details.
 *
 * Authority-controlled student fields:
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
public interface StudentService {

    /**
     * Creates and stores a new student.
     *
     * This operation is used by the Excel-import workflow.
     *
     * The implementation is responsible for:
     * - validating required authority fields
     * - checking duplicate student IDs
     * - creating the initial password hash
     * - setting editable fields to empty values
     * - marking the student as requiring an initial password change
     *
     * @param student student information received from the import process
     * @return newly created student
     */
    Student createStudent(Student student);

    /**
     * Finds a student using the authority-assigned student ID.
     *
     * This operation is used during student login and administrative
     * student lookup.
     *
     * @param studentId authority-assigned student ID
     * @return matching student, or null when not found
     */
    Student findByStudentId(String studentId);

    /**
     * Checks whether a student already exists with the supplied
     * student ID.
     *
     * @param studentId authority-assigned student ID
     * @return true when the student exists, otherwise false
     */
    boolean existsByStudentId(String studentId);

    /**
     * Retrieves all students.
     *
     * This is intended for administrative operations such as
     * viewing imported students.
     *
     * @return list of students
     */
    List<Student> findAll();

    /**
     * Updates only the student-editable profile information.
     *
     * Authority-controlled fields cannot be changed through this
     * operation.
     *
     * @param studentId authority-assigned student ID
     * @param email student's email address
     * @param dateOfBirth student's date of birth
     * @param fatherName father's name
     * @param fatherPhoneNumber father's phone number
     * @param motherName mother's name
     * @param motherPhoneNumber mother's phone number
     * @return true when the profile was updated successfully
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
     * Changes the student's password.
     *
     * The service implementation must verify the current password
     * before changing it and must BCrypt-hash the new password.
     *
     * @param studentId authority-assigned student ID
     * @param currentPassword current plain-text password supplied by student
     * @param newPassword new plain-text password supplied by student
     * @return true when the password was changed successfully
     */
    boolean changePassword(
            String studentId,
            String currentPassword,
            String newPassword);
}