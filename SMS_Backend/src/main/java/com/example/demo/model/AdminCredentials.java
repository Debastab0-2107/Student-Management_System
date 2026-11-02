package com.example.demo.model;

public class AdminCredentials {

    private String username;
    private String passwordHash;
    private boolean passwordChanged;

    public AdminCredentials() {
    }

    public AdminCredentials(
            String username,
            String passwordHash,
            boolean passwordChanged) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.passwordChanged = passwordChanged;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public boolean isPasswordChanged() {
        return passwordChanged;
    }

    public void setPasswordChanged(boolean passwordChanged) {
        this.passwordChanged = passwordChanged;
    }
}