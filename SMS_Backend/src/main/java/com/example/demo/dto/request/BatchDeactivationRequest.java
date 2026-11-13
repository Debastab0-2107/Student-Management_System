
package com.example.demo.dto.request;

/**
 * Request data for deactivating one completed student batch.
 *
 * The administrator supplies:
 * - sessionId
 * - courseId
 * - semesterId
 */
public class BatchDeactivationRequest {

    private String sessionId;
    private String courseId;
    private String semesterId;

    public BatchDeactivationRequest() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
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
