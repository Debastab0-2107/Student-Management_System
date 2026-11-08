
package com.example.demo.model;

/**
 * Represents a faculty member in the Student Management System.
 *
 * Permanent and visiting faculty share this model.
 * facultyType distinguishes between the two.
 */
public class Faculty {

    private String teacherId;
    private String name;
    private String phoneNumber;
    private String alternatePhoneNumber;
    private String educationalDetails;
    private String email;
    private String facultyType;
    private String deptId;
    private boolean status = true;

    /**
     * Default constructor required by Hibernate.
     */
    public Faculty() {
    }

    /**
     * Existing constructor retained for compatibility.
     */
    public Faculty(String teacherId, String name, String phoneNumber,
            String facultyType, String deptId, boolean status) {

        this.teacherId = teacherId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.facultyType = facultyType;
        this.deptId = deptId;
        this.status = status;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAlternatePhoneNumber() {
        return alternatePhoneNumber;
    }

    public void setAlternatePhoneNumber(String alternatePhoneNumber) {
        this.alternatePhoneNumber = alternatePhoneNumber;
    }

    public String getEducationalDetails() {
        return educationalDetails;
    }

    public void setEducationalDetails(String educationalDetails) {
        this.educationalDetails = educationalDetails;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFacultyType() {
        return facultyType;
    }

    public void setFacultyType(String facultyType) {
        this.facultyType = facultyType;
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Faculty [teacherId=" + teacherId
                + ", name=" + name
                + ", phoneNumber=" + phoneNumber
                + ", alternatePhoneNumber=" + alternatePhoneNumber
                + ", educationalDetails=" + educationalDetails
                + ", email=" + email
                + ", facultyType=" + facultyType
                + ", deptId=" + deptId
                + ", status=" + status + "]";
    }
}
