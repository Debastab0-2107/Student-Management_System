
package com.example.demo.dto.request;

/**
 * Request data for promoting one complete student batch.
 *
 * The administrator supplies the current semester.
 * The backend calculates the next semester automatically.
 */
public class BatchPromotionRequest {

    private String sessionId;
    private String courseId;
    private String currentSemesterId;

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

    public String getCurrentSemesterId() {
        return currentSemesterId;
    }

    public void setCurrentSemesterId(String currentSemesterId) {
        this.currentSemesterId = currentSemesterId;
    }
}
