package com.example.demo.model;

/**
 * Represents a faculty member in the Student Management System.
 *
 * Faculty and visiting faculty are represented by this same model.
 * The facultyType field distinguishes between the two.
 */
public class Faculty {

    private String teacherId;
    private String name;
    private String phoneNumber;
    private String facultyType;
    private String deptId;
    private boolean status;

    /**
     * Default constructor required for object creation and framework usage.
     */
    public Faculty() {
    }

    /**
     * Creates a Faculty object with all available faculty details.
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

    /**
     * Returns a readable representation of the Faculty object.
     */
    @Override
    public String toString() {
        return "Faculty [teacherId=" + teacherId
                + ", name=" + name
                + ", phoneNumber=" + phoneNumber
                + ", facultyType=" + facultyType
                + ", deptId=" + deptId
                + ", status=" + status + "]";
    }
}