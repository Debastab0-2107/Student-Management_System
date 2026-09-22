package com.example.demo.dto.request;

/*
 * LoginRequest
 * ------------
 * Represents the credentials sent by the client when
 * attempting to authenticate with the system.
 */
public class LoginRequest {

    /*
     * Username/login identifier supplied by the user.
     */
    private String username;

    /*
     * Password supplied by the user.
     */
    private String password;

    /*
     * Default constructor required for JSON deserialization.
     */
    public LoginRequest() {
    }

    /*
     * Parameterized constructor for convenient object creation.
     */
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    /*
     * Returns the username.
     */
    public String getUsername() {
        return username;
    }

    /*
     * Sets the username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /*
     * Returns the password.
     */
    public String getPassword() {
        return password;
    }

    /*
     * Sets the password.
     */
    public void setPassword(String password) {
        this.password = password;
    }
}