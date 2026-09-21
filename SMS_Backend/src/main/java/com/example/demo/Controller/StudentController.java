package com.example.demo.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;

/*
 * StudentController handles REST requests related to the Student portal.
 *
 * The controller is responsible only for receiving HTTP requests
 * and returning HTTP responses.
 *
 * Business logic belongs in StudentService.
 * Database operations belong in StudentDao.
 */
@RestController
@RequestMapping("/api/student")
public class StudentController {

	/*
	 * StudentService will be used to perform Student-related
	 * application operations.
	 *
	 * The actual Spring dependency injection will be configured
	 * when the service layer is activated.
	 */
	private StudentService studentService;


	/*
	 * Returns the profile of the currently logged-in student.
	 *
	 * Endpoint:
	 * GET /api/student/profile
	 *
	 * Maintainer note:
	 * According to the SRS, the student ID must eventually be
	 * resolved from the authenticated JWT rather than supplied
	 * by the client.
	 */
	@GetMapping("/profile")
	public Student getProfile() {

		/*
		 * TODO:
		 * Once Spring Security/JWT is implemented, obtain the
		 * student ID from the authenticated user's JWT and call:
		 *
		 * studentService.findByStudentId(studentId);
		 */

		return null;
	}

}