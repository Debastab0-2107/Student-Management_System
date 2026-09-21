package com.example.demo.model;

/*
 * Student is a model class that represents a student
 * in the Student Management System.
 *
 * This class contains the student-related data required
 * for the student profile and authentication workflow.
 *
 * Maintainer note:
 * This is currently a plain Java model class.
 * Hibernate/database mapping will be added during the
 * database implementation phase.
 */
public class Student {

	// Stores the unique student ID / roll number.
	// This is also used as the student's login username.
	private String studentId;

	// Stores the full name of the student.
	private String name;

	// Stores the student's phone number.
	// The phone number is used as the initial password
	// during onboarding before the student changes it.
	private String phoneNumber;

	// Stores the student's email address.
	private String email;

	// Stores the year in which the student was admitted.
	private String yearOfAdmission;

	// Stores the student's date of birth.
	private String dateOfBirth;

	// Stores the ID of the course in which the student is enrolled.
	private String courseId;

	// Stores the ID of the student's admission session.
	private String sessionId;

	// Stores the ID of the student's current semester.
	private String currentSemesterId;

	// Stores the salted BCrypt password hash.
	// Plain-text passwords must never be stored here.
	private String passwordHash;

	// Indicates whether the student must change the password
	// after the first login.
	private boolean mustChangePassword;


	/*
	 * Default constructor.
	 * Creates a Student object without initializing values.
	 */
	public Student() {
	}


	/*
	 * Parameterized constructor.
	 * Creates a Student object by initializing all attributes.
	 */
	public Student(String studentId, String name, String phoneNumber, String email,
			String yearOfAdmission, String dateOfBirth, String courseId,
			String sessionId, String currentSemesterId, String passwordHash,
			boolean mustChangePassword) {

		this.studentId = studentId;
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.yearOfAdmission = yearOfAdmission;
		this.dateOfBirth = dateOfBirth;
		this.courseId = courseId;
		this.sessionId = sessionId;
		this.currentSemesterId = currentSemesterId;
		this.passwordHash = passwordHash;
		this.mustChangePassword = mustChangePassword;
	}


	// Getter and setter methods

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getYearOfAdmission() {
		return yearOfAdmission;
	}

	public void setYearOfAdmission(String yearOfAdmission) {
		this.yearOfAdmission = yearOfAdmission;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getCourseId() {
		return courseId;
	}

	public void setCourseId(String courseId) {
		this.courseId = courseId;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getCurrentSemesterId() {
		return currentSemesterId;
	}

	public void setCurrentSemesterId(String currentSemesterId) {
		this.currentSemesterId = currentSemesterId;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public boolean isMustChangePassword() {
		return mustChangePassword;
	}

	public void setMustChangePassword(boolean mustChangePassword) {
		this.mustChangePassword = mustChangePassword;
	}


	/*
	 * Returns a readable representation of the Student object.
	 *
	 * Security note:
	 * passwordHash is intentionally NOT included in toString()
	 * so that password information is not accidentally exposed
	 * in logs or console output.
	 */
	@Override
	public String toString() {
		return "Student [studentId=" + studentId
				+ ", name=" + name
				+ ", phoneNumber=" + phoneNumber
				+ ", email=" + email
				+ ", yearOfAdmission=" + yearOfAdmission
				+ ", dateOfBirth=" + dateOfBirth
				+ ", courseId=" + courseId
				+ ", sessionId=" + sessionId
				+ ", currentSemesterId=" + currentSemesterId
				+ ", mustChangePassword=" + mustChangePassword
				+ "]";
	}

} // End of class