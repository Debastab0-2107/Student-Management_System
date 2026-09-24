package com.example.demo.model;

/**
 * Represents academic marks obtained by a student for a subject.
 *
 * This class is a plain Java model used by the Marks DAO, service,
 * controller, and native Hibernate mapping layers.
 */
public class Marks {

    /** Unique identifier of the marks record. */
    private String marksId;

    /** Identifier of the student who obtained the marks. */
    private String studentId;

    /** Identifier of the subject for which the marks were obtained. */
    private String subjectId;

    /** Marks obtained by the student. */
    private Double marks;

    /**
     * Creates an empty Marks object.
     */
    public Marks() {
    }

    /**
     * Creates a Marks object with all supported marks details.
     *
     * @param marksId unique marks record identifier
     * @param studentId student identifier
     * @param subjectId subject identifier
     * @param marks marks obtained
     */
    public Marks(String marksId, String studentId, String subjectId, Double marks) {
        this.marksId = marksId;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.marks = marks;
    }

    /**
     * Returns the marks record identifier.
     *
     * @return marks record identifier
     */
    public String getMarksId() {
        return marksId;
    }

    /**
     * Sets the marks record identifier.
     *
     * @param marksId marks record identifier
     */
    public void setMarksId(String marksId) {
        this.marksId = marksId;
    }

    /**
     * Returns the student identifier.
     *
     * @return student identifier
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * Sets the student identifier.
     *
     * @param studentId student identifier
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
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
     * Returns the marks obtained.
     *
     * @return marks obtained
     */
    public Double getMarks() {
        return marks;
    }

    /**
     * Sets the marks obtained.
     *
     * @param marks marks obtained
     */
    public void setMarks(Double marks) {
        this.marks = marks;
    }

    /**
     * Returns a string representation of the Marks object.
     *
     * @return marks details as a string
     */
    @Override
    public String toString() {
        return "Marks{" +
                "marksId='" + marksId + '\'' +
                ", studentId='" + studentId + '\'' +
                ", subjectId='" + subjectId + '\'' +
                ", marks=" + marks +
                '}';
    }
}