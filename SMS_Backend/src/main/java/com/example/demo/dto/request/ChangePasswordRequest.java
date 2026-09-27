package com.example.demo.dto.request;

/**
 * ChangePasswordRequest
 *
 * Request DTO used when an authenticated student changes
 * their account password.
 *
 * The request contains:
 *
 * - currentPassword
 * - newPassword
 *
 * The studentId is intentionally NOT included.
 *
 * The authenticated student's ID is obtained from the JWT
 * by the controller, so a student cannot submit another
 * student's ID to change that student's password.
 */
public class ChangePasswordRequest {

    /*
     * The student's current password.
     *
     * This is used by the service to verify the existing
     * BCrypt password hash.
     */
    private String currentPassword;

    /*
     * The new password selected by the student.
     *
     * The service will BCrypt-hash this value before it
     * is stored in the database.
     */
    private String newPassword;

    /**
     * Default constructor required by Jackson for
     * JSON request deserialization.
     */
    public ChangePasswordRequest() {
    }

    /**
     * Returns the current password.
     *
     * @return current password
     */
    public String getCurrentPassword() {
        return currentPassword;
    }

    /**
     * Sets the current password.
     *
     * @param currentPassword current password
     */
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    /**
     * Returns the new password.
     *
     * @return new password
     */
    public String getNewPassword() {
        return newPassword;
    }

    /**
     * Sets the new password.
     *
     * @param newPassword new password
     */
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}