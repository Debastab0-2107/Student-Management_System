
package com.example.demo.service;

import java.util.List;

public class CAExcelRow {

    private String studentId;
    private String teacherId;
    private String subjectId;
    private List<Double> mcqMarks;
    private List<Double> descriptiveMarks;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public List<Double> getMcqMarks() {
        return mcqMarks;
    }

    public void setMcqMarks(List<Double> mcqMarks) {
        this.mcqMarks = mcqMarks;
    }

    public List<Double> getDescriptiveMarks() {
        return descriptiveMarks;
    }

    public void setDescriptiveMarks(List<Double> descriptiveMarks) {
        this.descriptiveMarks = descriptiveMarks;
    }
}
