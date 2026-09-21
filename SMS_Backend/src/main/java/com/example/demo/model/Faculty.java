package com.example.demo.model;

/*
 * Faculty is a model class that represents a faculty member
 * in the Student Management System.
 *
 * This class contains the faculty-related data and provides
 * constructors, getters, setters, and a toString() method
 * for working with Faculty objects.
 */
public class Faculty {

	// Attributes (instance variables)
	// Stores the unique ID of the faculty member.
	private String teacherId;

	// Stores the full name of the faculty member.
	private String name;

	// Stores the contact phone number of the faculty member.
	private String phoneNumber;

	// Stores the type of faculty, such as Permanent or Visiting.
	private String facultyType;

	// Stores the ID of the department to which the faculty belongs.
	private String deptId;

	// Stores the active/inactive status of the faculty member.
	private boolean status;


	// Overloaded constructors

	/*
	 * Default constructor.
	 * Creates a Faculty object without initializing any values.
	 */
	public Faculty() {}

	/*
	 * Parameterized constructor.
	 * Creates a Faculty object by initializing all faculty attributes
	 * with the values provided as arguments.
	 */
	public Faculty(String teacherId, String name, String phoneNumber, String facultyType, String deptId,
			boolean status) {

		this.teacherId = teacherId;
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.facultyType = facultyType;
		this.deptId = deptId;
		this.status = status;
	}


	// Getter-Setter methods

	/*
	 * Returns the unique ID of the faculty member.
	 */
	public String getTeacherId() {
		return teacherId;
	}

	/*
	 * Sets the unique ID of the faculty member.
	 */
	public void setTeacherId(String teacherId) {
		this.teacherId = teacherId;
	}

	/*
	 * Returns the name of the faculty member.
	 */
	public String getName() {
		return name;
	}

	/*
	 * Sets the name of the faculty member.
	 */
	public void setName(String name) {
		this.name = name;
	}

	/*
	 * Returns the phone number of the faculty member.
	 */
	public String getPhoneNumber() {
		return phoneNumber;
	}

	/*
	 * Sets the phone number of the faculty member.
	 */
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	/*
	 * Returns the type of the faculty member.
	 */
	public String getFacultyType() {
		return facultyType;
	}

	/*
	 * Sets the type of the faculty member.
	 */
	public void setFacultyType(String facultyType) {
		this.facultyType = facultyType;
	}

	/*
	 * Returns the department ID associated with the faculty member.
	 */
	public String getDeptId() {
		return deptId;
	}

	/*
	 * Sets the department ID associated with the faculty member.
	 */
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	/*
	 * Returns the current status of the faculty member.
	 * Since status is a boolean value, the getter follows
	 * the "is" naming convention.
	 */
	public boolean isStatus() {
		return status;
	}

	/*
	 * Sets the active/inactive status of the faculty member.
	 */
	public void setStatus(boolean status) {
		this.status = status;
	}


	/*
	 * toString() method for displaying the Faculty object's
	 * attribute values in a readable format, mainly useful
	 * for console output and debugging.
	 */
	@Override
	public String toString() {
		return "Faculty [teacherId=" + teacherId +
				", name=" + name + ", "
				+ "phoneNumber=" + phoneNumber + ", "
				+ "facultyType=" + facultyType + ", "
				+ "deptId=" + deptId + ", "
				+ "status=" + status + "]";
	}

} // End of class