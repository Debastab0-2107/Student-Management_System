package com.example.demo.dto.response;

import com.example.demo.model.Student;

public class FacultyStudentResponse {

    private String studentId;
    private String name;
    private String phoneNumber;
    private String email;
    private String dateOfBirth;
    private String courseId;
    private String sessionId;
    private String currentSemesterId;
    private String fatherName;
    private String fatherPhoneNumber;
    private String motherName;
    private String motherPhoneNumber;
    private boolean active;

    public FacultyStudentResponse(Student student) {

        this.studentId = student.getStudentId();
        this.name = student.getName();
        this.phoneNumber = student.getPhoneNumber();
        this.email = student.getEmail();
        this.dateOfBirth = student.getDateOfBirth();
        this.courseId = student.getCourseId();
        this.sessionId = student.getSessionId();
        this.currentSemesterId = student.getCurrentSemesterId();
        this.fatherName = student.getFatherName();
        this.fatherPhoneNumber = student.getFatherPhoneNumber();
        this.motherName = student.getMotherName();
        this.motherPhoneNumber = student.getMotherPhoneNumber();
        this.active = student.isActive();
    }

    public String getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public String getCourseId() {
        return courseId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getCurrentSemesterId() {
        return currentSemesterId;
    }

    public String getFatherName() {
        return fatherName;
    }

    public String getFatherPhoneNumber() {
        return fatherPhoneNumber;
    }

    public String getMotherName() {
        return motherName;
    }

    public String getMotherPhoneNumber() {
        return motherPhoneNumber;
    }

    public boolean isActive() {
        return active;
    }
}