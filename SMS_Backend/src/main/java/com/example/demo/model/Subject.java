package com.example.demo.model;

/**
 * Represents an academic subject offered in the Student Management System.
 *
 * This class is a plain Java model used by the Subject DAO, service,
 * controller, and native Hibernate mapping layers.
 */
public class Subject {

    /** Unique identifier of the subject. */
    private String subjectId;

    /** Name of the subject. */
    private String subjectName;

    /** Identifier of the course to which the subject belongs. */
    private String courseId;

    /** Identifier of the semester in which the subject is offered. */
    private String semesterId;

    /**
     * Creates an empty Subject object.
     */
    public Subject() {
    }

    /**
     * Creates a Subject object with all supported subject details.
     *
     * @param subjectId unique subject identifier
     * @param subjectName subject name
     * @param courseId course identifier
     * @param semesterId semester identifier
     */
    public Subject(String subjectId, String subjectName, String courseId, String semesterId) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.courseId = courseId;
        this.semesterId = semesterId;
    }

    /**
     * Returns the subject identifier.
     *
     * @return subject identifier
     */
    public String getSubjectId() {
        return subjectId;
    }

    /**
     * Sets the subject identifier.
     *
     * @param subjectId subject identifier
     */
    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    /**
     * Returns the subject name.
     *
     * @return subject name
     */
    public String getSubjectName() {
        return subjectName;
    }

    /**
     * Sets the subject name.
     *
     * @param subjectName subject name
     */
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    /**
     * Returns the course identifier.
     *
     * @return course identifier
     */
    public String getCourseId() {
        return courseId;
    }

    /**
     * Sets the course identifier.
     *
     * @param courseId course identifier
     */
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    /**
     * Returns the semester identifier.
     *
     * @return semester identifier
     */
    public String getSemesterId() {
        return semesterId;
    }

    /**
     * Sets the semester identifier.
     *
     * @param semesterId semester identifier
     */
    public void setSemesterId(String semesterId) {
        this.semesterId = semesterId;
    }

    /**
     * Returns a string representation of the Subject object.
     *
     * @return subject details as a string
     */
    @Override
    public String toString() {
        return "Subject{" +
                "subjectId='" + subjectId + '\'' +
                ", subjectName='" + subjectName + '\'' +
                ", courseId='" + courseId + '\'' +
                ", semesterId='" + semesterId + '\'' +
                '}';
    }
}