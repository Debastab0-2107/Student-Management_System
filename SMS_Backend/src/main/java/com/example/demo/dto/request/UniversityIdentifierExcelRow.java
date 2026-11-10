package com.example.demo.dto.request;

public class UniversityIdentifierExcelRow {

    private String studentId;
    private String name;
    private String roll;
    private String reg;
    private String batch;

    public UniversityIdentifierExcelRow() {
    }

    public UniversityIdentifierExcelRow(
            String studentId,
            String name,
            String roll,
            String reg,
            String batch) {

        this.studentId = studentId;
        this.name = name;
        this.roll = roll;
        this.reg = reg;
        this.batch = batch;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getRoll() {
        return roll;
    }

    public String getReg() {
        return reg;
    }

    public String getBatch() {
        return batch;
    }
}