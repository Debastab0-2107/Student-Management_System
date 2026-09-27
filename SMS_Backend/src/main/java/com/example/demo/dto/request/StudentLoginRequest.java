package com.example.demo.dto.request;

/**
 * StudentLoginRequest
 *
 * Request DTO used when a student authenticates with the
 * Student Management System.
 *
 * Student login requires only two values:
 *
 * - studentId
 * - password
 *
 * The student ID is supplied by the higher authority and identifies
 * the student's database record.
 *
 * The password is the student's current password.
 *
 * For a newly imported student, the initial password is the
 * student's contact number.
 *
 * This DTO is used only for receiving login data.
 * It is not a database model.
 */
public class StudentLoginRequest {

    /*
     * Authority-assigned student ID.
     */
    private String studentId;

    /*
     * Student's current login password.
     *
     * This value is used only during authentication and is never
     * stored directly in the database.
     */
    private String password;

    /**
     * Default constructor required by Jackson for JSON deserialization.
     */
    public StudentLoginRequest() {
    }

    /**
     * Returns the student ID.
     *
     * @return authority-assigned student ID
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * Sets the student ID.
     *
     * @param studentId authority-assigned student ID
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    /**
     * Returns the supplied password.
     *
     * @return student's password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the supplied password.
     *
     * @param password student's password
     */
    public void setPassword(String password) {
        this.password = password;
    }
}