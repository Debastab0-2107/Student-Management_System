package com.example.demo.dao;

public interface SubjectTeacherAssignmentDao {
    boolean isActiveTeacher(String teacherId);
    boolean isActiveSubject(String subjectId);
    boolean assignmentExists(String teacherId, String subjectId, String sessionId);
    void activate(String teacherId, String subjectId, String sessionId);
    void deactivate(String teacherId, String subjectId, String sessionId);
}