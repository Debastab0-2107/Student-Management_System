
package com.example.demo.model;

public class CAMarks {

    private String marksId;
    private String studentId;
    private String teacherId;
    private String subjectId;
    private java.math.BigDecimal totalMarks;
    private String sem;
    private int caNo;

    public CAMarks() {
    }

    public String getMarksId() {
        return marksId;
    }

    public void setMarksId(String marksId) {
        this.marksId = marksId;
    }

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

    public java.math.BigDecimal getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(java.math.BigDecimal totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getSem() {
        return sem;
    }

    public void setSem(String sem) {
        this.sem = sem;
    }

    public int getCaNo() {
        return caNo;
    }

    public void setCaNo(int caNo) {
        this.caNo = caNo;
    }
}
