package com.example.demo.model;

import java.time.LocalDateTime;

/** Represents one teacher's assignment to one subject for an academic session. */
public class SubjectTeacherAssignment {
    private String teacherId;
    private String subjectId;
    private String sessionId;
    private boolean active = true;
    private LocalDateTime assignedAt;
    private LocalDateTime updatedAt;

    public SubjectTeacherAssignment() {}

    public SubjectTeacherAssignment(String teacherId, String subjectId,
                                    String sessionId, boolean active) {
        this.teacherId = teacherId;
        this.subjectId = subjectId;
        this.sessionId = sessionId;
        this.active = active;
    }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}