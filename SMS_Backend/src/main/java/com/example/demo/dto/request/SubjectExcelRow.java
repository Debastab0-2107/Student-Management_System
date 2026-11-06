package com.example.demo.dto.request;

public class SubjectExcelRow {

    private String subjectId;
    private String subjectName;
    private String courseId;
    private String semesterId;

    public SubjectExcelRow() {
    }

    public SubjectExcelRow(
            String subjectId,
            String subjectName,
            String courseId,
            String semesterId) {

        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.courseId = courseId;
        this.semesterId = semesterId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getSemesterId() {
        return semesterId;
    }

    public void setSemesterId(String semesterId) {
        this.semesterId = semesterId;
    }
}