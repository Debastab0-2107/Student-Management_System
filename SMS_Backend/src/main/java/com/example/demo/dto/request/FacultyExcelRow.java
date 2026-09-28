package com.example.demo.dto.request;

/**
 * FacultyExcelRow
 *
 * Represents one row from the authority-provided
 * Regular Faculty Excel file.
 *
 * Expected Excel columns:
 *
 * teacherId | name | phoneNumber | facultyType | deptId
 */
public class FacultyExcelRow {

    private String teacherId;
    private String name;
    private String phoneNumber;
    private String facultyType;
    private String deptId;

    /**
     * Default constructor required for DTO creation.
     */
    public FacultyExcelRow() {
    }

    /**
     * Creates a faculty Excel row.
     */
    public FacultyExcelRow(
            String teacherId,
            String name,
            String phoneNumber,
            String facultyType,
            String deptId) {

        this.teacherId = teacherId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.facultyType = facultyType;
        this.deptId = deptId;
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
}