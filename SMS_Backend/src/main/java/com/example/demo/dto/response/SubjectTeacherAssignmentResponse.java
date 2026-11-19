package com.example.demo.dto.response;

public class SubjectTeacherAssignmentResponse {

    private String teacherId;
    private String teacherName;
    private boolean teacherActive;

    private String subjectId;
    private String subjectName;

    private String sessionId;

    public SubjectTeacherAssignmentResponse() {
    }

    public SubjectTeacherAssignmentResponse(
            String teacherId,
            String teacherName,
            boolean teacherActive,
            String subjectId,
            String subjectName,
            String sessionId) {

        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherActive = teacherActive;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.sessionId = sessionId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public boolean isTeacherActive() {
        return teacherActive;
    }

    public void setTeacherActive(boolean teacherActive) {
        this.teacherActive = teacherActive;
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

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}