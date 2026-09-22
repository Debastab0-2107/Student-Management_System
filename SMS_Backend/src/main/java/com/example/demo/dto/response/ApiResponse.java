package com.example.demo.dto.response;

/*
 * ApiResponse
 * -----------
 * Generic response object used by backend APIs when a simple
 * success/failure message needs to be returned.
 */
public class ApiResponse {

    /*
     * Indicates whether the requested operation was successful.
     */
    private boolean success;

    /*
     * Human-readable response message.
     */
    private String message;

    /*
     * Default constructor required for JSON serialization.
     */
    public ApiResponse() {
    }

    /*
     * Parameterized constructor.
     */
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    /*
     * Returns whether the operation was successful.
     */
    public boolean isSuccess() {
        return success;
    }

    /*
     * Sets the success status.
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /*
     * Returns the response message.
     */
    public String getMessage() {
        return message;
    }

    /*
     * Sets the response message.
     */
    public void setMessage(String message) {
        this.message = message;
    }
}