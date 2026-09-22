package com.example.demo.dto.response;

/*
 * LoginResponse
 * -------------
 * Represents the response returned after a successful
 * authentication operation.
 */
public class LoginResponse {

    /*
     * JWT token generated after successful authentication.
     */
    private String token;

    /*
     * Username associated with the authenticated account.
     */
    private String username;

    /*
     * Role of the authenticated user.
     *
     * Examples may include ADMIN, FACULTY or STUDENT.
     */
    private String role;

    /*
     * Default constructor required for JSON serialization.
     */
    public LoginResponse() {
    }

    /*
     * Parameterized constructor.
     */
    public LoginResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    /*
     * Returns the JWT token.
     */
    public String getToken() {
        return token;
    }

    /*
     * Sets the JWT token.
     */
    public void setToken(String token) {
        this.token = token;
    }

    /*
     * Returns the authenticated username.
     */
    public String getUsername() {
        return username;
    }

    /*
     * Sets the authenticated username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /*
     * Returns the authenticated user's role.
     */
    public String getRole() {
        return role;
    }

    /*
     * Sets the authenticated user's role.
     */
    public void setRole(String role) {
        this.role = role;
    }
}