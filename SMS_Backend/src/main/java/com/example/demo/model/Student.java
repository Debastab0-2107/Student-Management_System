package com.example.demo.model;

/**
 * Student
 *
 * Represents a student in the Student Management System.
 *
 * Student information is divided into two categories:
 *
 * 1. Authority-controlled fields:
 *    - studentId
 *    - name
 *    - phoneNumber
 *    - courseId
 *    - sessionId
 *
 *    These values are supplied through the authority Excel sheet
 *    and must not be changed by the student.
 *
 * 2. Student-editable fields:
 *    - email
 *    - dateOfBirth
 *    - fatherName
 *    - fatherPhoneNumber
 *    - motherName
 *    - motherPhoneNumber
 *    - password
 *
 *    These fields can be completed or modified by the student
 *    after successful login, according to the application's
 *    authorization rules.
 *
 * Security:
 * - The actual student password is never stored.
 * - passwordHash stores only the BCrypt password hash.
 * - passwordHash is intentionally excluded from toString().
 */
public class Student {

    /*
     * Authority-controlled unique student ID / roll number.
     *
     * This value is supplied through the authority Excel sheet
     * and must not be changed by the student.
     */
    private String studentId;

    /*
     * Authority-controlled full name of the student.
     */
    private String name;

    /*
     * Authority-controlled contact number of the student.
     *
     * This number is also used as the student's initial password
     * before the student changes the password.
     */
    private String phoneNumber;

    /*
     * Student-editable email address.
     *
     * The value is initially stored as an empty string when the
     * student is created through the authority Excel upload.
     */
    private String email;

    /*
     * Student-editable date of birth.
     *
     * The value is initially stored as an empty string when the
     * student is imported.
     */
    private String dateOfBirth;

    /*
     * Authority-controlled course ID.
     *
     * This value comes from the authority Excel sheet and must
     * not be changed by the student.
     */
    private String courseId;

    /*
     * Authority-controlled academic session ID.
     *
     * This value comes from the authority Excel sheet and must
     * not be changed by the student.
     */
    private String sessionId;

    /*
     * Student-editable father's name.
     *
     * Initially stored as an empty string.
     */
    private String fatherName;

    /*
     * Student-editable father's contact number.
     *
     * Initially stored as an empty string.
     */
    private String fatherPhoneNumber;

    /*
     * Student-editable mother's name.
     *
     * Initially stored as an empty string.
     */
    private String motherName;

    /*
     * Student-editable mother's contact number.
     *
     * Initially stored as an empty string.
     */
    private String motherPhoneNumber;

    /*
     * Stores the BCrypt hash of the student's password.
     *
     * The plain-text password must never be stored in the database.
     */
    private String passwordHash;

    /*
     * Indicates whether the student must change the initial
     * password after the first successful login.
     *
     * New students imported from Excel will normally have this
     * value set to true because their initial password is their
     * phone number.
     */
    private boolean mustChangePassword;

    /**
     * Default constructor.
     *
     * Required by Hibernate for creating Student objects.
     */
    public Student() {
    }

    /**
     * Parameterized constructor.
     *
     * Creates a Student object with all available student data.
     *
     * @param studentId unique student ID / roll number
     * @param name student's full name
     * @param phoneNumber authority-provided phone number
     * @param email student's email address
     * @param dateOfBirth student's date of birth
     * @param courseId authority-provided course ID
     * @param sessionId authority-provided academic session ID
     * @param fatherName father's name
     * @param fatherPhoneNumber father's phone number
     * @param motherName mother's name
     * @param motherPhoneNumber mother's phone number
     * @param passwordHash BCrypt password hash
     * @param mustChangePassword whether the student must change
     *                           the initial password
     */
    public Student(
            String studentId,
            String name,
            String phoneNumber,
            String email,
            String dateOfBirth,
            String courseId,
            String sessionId,
            String fatherName,
            String fatherPhoneNumber,
            String motherName,
            String motherPhoneNumber,
            String passwordHash,
            boolean mustChangePassword) {

        this.studentId = studentId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.courseId = courseId;
        this.sessionId = sessionId;
        this.fatherName = fatherName;
        this.fatherPhoneNumber = fatherPhoneNumber;
        this.motherName = motherName;
        this.motherPhoneNumber = motherPhoneNumber;
        this.passwordHash = passwordHash;
        this.mustChangePassword = mustChangePassword;
    }

    /**
     * Returns the student's unique ID / roll number.
     *
     * @return student ID
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * Sets the student's unique ID / roll number.
     *
     * This value should only be assigned during authority
     * Excel import or administrative processing.
     *
     * @param studentId student ID
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    /**
     * Returns the student's name.
     *
     * @return student name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the student's name.
     *
     * @param name student name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns the student's authority-provided phone number.
     *
     * @return phone number
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     * Sets the student's authority-provided phone number.
     *
     * @param phoneNumber phone number
     */
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    /**
     * Returns the student's email address.
     *
     * @return email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the student's email address.
     *
     * This field is intended to be editable by the student
     * after authentication.
     *
     * @param email email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Returns the student's date of birth.
     *
     * @return date of birth
     */
    public String getDateOfBirth() {
        return dateOfBirth;
    }

    /**
     * Sets the student's date of birth.
     *
     * @param dateOfBirth date of birth
     */
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    /**
     * Returns the student's course ID.
     *
     * @return course ID
     */
    public String getCourseId() {
        return courseId;
    }

    /**
     * Sets the student's course ID.
     *
     * This value is authority-controlled and should not be
     * modified through the student profile API.
     *
     * @param courseId course ID
     */
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    /**
     * Returns the student's academic session ID.
     *
     * @return session ID
     */
    public String getSessionId() {
        return sessionId;
    }

    /**
     * Sets the student's academic session ID.
     *
     * This value is authority-controlled and should not be
     * modified through the student profile API.
     *
     * @param sessionId academic session ID
     */
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * Returns the father's name.
     *
     * @return father's name
     */
    public String getFatherName() {
        return fatherName;
    }

    /**
     * Sets the father's name.
     *
     * @param fatherName father's name
     */
    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    /**
     * Returns the father's phone number.
     *
     * @return father's phone number
     */
    public String getFatherPhoneNumber() {
        return fatherPhoneNumber;
    }

    /**
     * Sets the father's phone number.
     *
     * @param fatherPhoneNumber father's phone number
     */
    public void setFatherPhoneNumber(String fatherPhoneNumber) {
        this.fatherPhoneNumber = fatherPhoneNumber;
    }

    /**
     * Returns the mother's name.
     *
     * @return mother's name
     */
    public String getMotherName() {
        return motherName;
    }

    /**
     * Sets the mother's name.
     *
     * @param motherName mother's name
     */
    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    /**
     * Returns the mother's phone number.
     *
     * @return mother's phone number
     */
    public String getMotherPhoneNumber() {
        return motherPhoneNumber;
    }

    /**
     * Sets the mother's phone number.
     *
     * @param motherPhoneNumber mother's phone number
     */
    public void setMotherPhoneNumber(String motherPhoneNumber) {
        this.motherPhoneNumber = motherPhoneNumber;
    }

    /**
     * Returns the BCrypt password hash.
     *
     * @return password hash
     */
    public String getPasswordHash() {
        return passwordHash;
    }

    /**
     * Sets the BCrypt password hash.
     *
     * Plain-text passwords must never be passed to this field.
     *
     * @param passwordHash BCrypt password hash
     */
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    /**
     * Returns whether the student must change the initial password.
     *
     * @return true when the student must change the password
     */
    public boolean isMustChangePassword() {
        return mustChangePassword;
    }

    /**
     * Sets whether the student must change the initial password.
     *
     * @param mustChangePassword password-change requirement
     */
    public void setMustChangePassword(boolean mustChangePassword) {
        this.mustChangePassword = mustChangePassword;
    }

    /**
     * Returns a readable representation of the Student object.
     *
     * Security note:
     * passwordHash is intentionally excluded from the output.
     *
     * @return readable Student representation
     */
    @Override
    public String toString() {
        return "Student [studentId=" + studentId
                + ", name=" + name
                + ", phoneNumber=" + phoneNumber
                + ", email=" + email
                + ", dateOfBirth=" + dateOfBirth
                + ", courseId=" + courseId
                + ", sessionId=" + sessionId
                + ", fatherName=" + fatherName
                + ", fatherPhoneNumber=" + fatherPhoneNumber
                + ", motherName=" + motherName
                + ", motherPhoneNumber=" + motherPhoneNumber
                + ", mustChangePassword=" + mustChangePassword
                + "]";
    }
}