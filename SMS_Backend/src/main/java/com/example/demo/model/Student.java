package com.example.demo.model;

public class Student {
	
	//attributes
	private String studentId;
	private String name;
	private String phoneNumber;
	private String email;
	private String yearOfAdmission;
	private String dateOfBirth;
	private String courseId;
	private String sessionId;
	private String currentSemesterId;
	private String passwordHash;
	private boolean mustChangePassword;
	
	//overloaded constructor
	public Student() {}
	public Student(String studentId, String name, String phoneNumber, String email, String yearOfAdmission,
			String dateOfBirth, String courseId, String sessionId, String currentSemesterId,String passwordHash,
			boolean mustChangePassword) {
		super();
		this.studentId = studentId;
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.yearOfAdmission = yearOfAdmission;
		this.dateOfBirth = dateOfBirth;
		this.courseId = courseId;
		this.sessionId = sessionId;
		this.currentSemesterId = currentSemesterId;
		this.passwordHash=passwordHash;
		this.mustChangePassword = mustChangePassword;
	}
	
	//getter setter
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
	@Override
	public String toString() {
		return "Student [studentId=" + studentId + ", name=" + name + ", phoneNumber=" + phoneNumber + ", email="
				+ email + ", yearOfAdmission=" + yearOfAdmission + ", dateOfBirth=" + dateOfBirth + ", courseId="
				+ courseId + ", sessionId=" + sessionId + ", currentSemesterId=" + currentSemesterId + ", passwordHash="
				+ passwordHash + ", mustChangePassword=" + mustChangePassword + "]";
	}
	
	//override toString() method
	
	
	
	
	
}
