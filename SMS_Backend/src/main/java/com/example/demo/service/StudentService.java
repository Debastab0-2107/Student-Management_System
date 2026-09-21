package com.example.demo.service;

import com.example.demo.model.Student;

/*
 * StudentService defines the service-layer operations related to Student.
 *
 * This interface acts as a contract between the Controller layer and
 * the Service Implementation layer.
 *
 * The service layer is responsible for handling Student-related
 * application operations and delegating data-access work to StudentDao.
 *
 * The actual implementation is provided by StudentServiceImpl
 * in the service.impl package.
 */
public interface StudentService {

	/*
	 * Finds a Student using the student's unique ID.
	 *
	 * Student-scoped requests will eventually obtain the student ID
	 * from the authenticated JWT rather than from a request parameter.
	 *
	 * @param studentId unique ID / roll number of the student.
	 * @return the matching Student object.
	 */
	Student findByStudentId(String studentId);

}