package com.example.demo.dto.request;

/**
 * StudentExcelRow
 *
 * Represents one student row read from the authority-provided
 * Excel spreadsheet.
 *
 * These are the authority-controlled fields that are expected
 * from the Excel file:
 *
 * - studentId
 * - name
 * - phoneNumber
 * - courseId
 * - sessionId
 *
 * The initial student password is NOT read from Excel.
 * The StudentService will use the student's phone number
 * as the initial password and store only its BCrypt hash.
 */
public class StudentExcelRow {

    private String studentId;
    private String name;
    private String phoneNumber;
    private String courseId;
    private String sessionId;

    /**
     * Default constructor.
     *
     * Required for creating the DTO before assigning values.
     */
    public StudentExcelRow() {
    }

    /**
     * Parameterized constructor.
     *
     * Creates one Excel row object with all authority-controlled
     * student information.
     *
     * @param studentId student ID supplied by the authority
     * @param name student name supplied by the authority
     * @param phoneNumber student contact number supplied by the authority
     * @param courseId course ID supplied by the authority
     * @param sessionId academic session supplied by the authority
     */
    public StudentExcelRow(
            String studentId,
            String name,
            String phoneNumber,
            String courseId,
            String sessionId) {

        this.studentId = studentId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.courseId = courseId;
        this.sessionId = sessionId;
    }

    /**
     * Returns the student ID.
     *
     * @return student ID
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * Sets the student ID.
     *
     * @param studentId student ID
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    /**
     * Returns the student name.
     *
     * @return student name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the student name.
     *
     * @param name student name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns the student phone number.
     *
     * @return phone number
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     * Sets the student phone number.
     *
     * @param phoneNumber student phone number
     */
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    /**
     * Returns the course ID.
     *
     * @return course ID
     */
    public String getCourseId() {
        return courseId;
    }

    /**
     * Sets the course ID.
     *
     * @param courseId course ID
     */
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    /**
     * Returns the academic session ID.
     *
     * @return session ID
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * Sets the academic session ID.
     *
     * @param sessionId academic session ID
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * Returns a safe textual representation of this Excel row.
     *
     * No password is included because the Excel row does not
     * contain a password field.
     *
     * @return textual representation of the Excel row
     */
    @Override
    public String toString() {
        return "StudentExcelRow [studentId=" + studentId
                + ", name=" + name
                + ", phoneNumber=" + phoneNumber
                + ", courseId=" + courseId
                + ", sessionId=" + sessionId
                + "]";
    }
}