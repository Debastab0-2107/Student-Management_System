package com.example.demo.dto.request;

/**
 * StudentProfileUpdateRequest
 *
 * Request DTO used when an authenticated student updates
 * their personal profile information.
 *
 * Only student-editable fields are included in this DTO.
 *
 * Authority-controlled fields are intentionally NOT included:
 *
 * - studentId
 * - name
 * - phoneNumber
 * - courseId
 * - sessionId
 *
 * Those values are controlled by the higher authority and must
 * not be changed by the student.
 *
 * The student's identity is obtained from the authenticated JWT,
 * not from this request body.
 */
public class StudentProfileUpdateRequest {

    /*
     * Student's email address.
     */
    private String email;

    /*
     * Student's date of birth.
     */
    private String dateOfBirth;

    /*
     * Student's father's name.
     */
    private String fatherName;

    /*
     * Student's father's phone number.
     */
    private String fatherPhoneNumber;

    /*
     * Student's mother's name.
     */
    private String motherName;

    /*
     * Student's mother's phone number.
     */
    private String motherPhoneNumber;

    /**
     * Default constructor required by Jackson for
     * JSON request deserialization.
     */
    public StudentProfileUpdateRequest() {
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
}