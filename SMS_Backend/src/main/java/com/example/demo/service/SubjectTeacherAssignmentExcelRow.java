package com.example.demo.service;

/** One row from the administrator's assignment workbook. */
public class SubjectTeacherAssignmentExcelRow {
    private String teacherId;
    private String subjectId;
    private String sessionId;
    private String action;

    public SubjectTeacherAssignmentExcelRow() {}

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}