package com.example.demo.dto.request;

/**
 * FacultyDeactivateExcelRow
 *
 * Represents one row from the authority-provided
 * Regular Faculty deactivation Excel file.
 *
 * The removal/deactivation file intentionally contains
 * only the teacher ID.
 *
 * Expected column:
 *
 * teacherId
 */
public class FacultyDeactivateExcelRow {

    private String teacherId;

    /**
     * Default constructor required for DTO creation.
     */
    public FacultyDeactivateExcelRow() {
    }

    /**
     * Creates a deactivation row.
     *
     * @param teacherId faculty identifier
     */
    public FacultyDeactivateExcelRow(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }
}