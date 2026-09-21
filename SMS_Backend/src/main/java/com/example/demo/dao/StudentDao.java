package com.example.demo.dao;

import com.example.demo.model.Student;

/*
 * StudentDao defines the Data Access Object (DAO) operations
 * related to the Student model.
 *
 * This interface provides the contract for retrieving and
 * managing Student data.
 *
 * The actual database implementation will be provided by
 * StudentDaoImpl in the dao.impl package.
 */
public interface StudentDao {

	/*
	 * Finds a Student using the student's unique ID.
	 *
	 * The student ID is also the student's login username.
	 *
	 * @param studentId unique ID / roll number of the student.
	 * @return the matching Student object, if found.
	 */
	Student findByStudentId(String studentId);

}