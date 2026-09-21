package com.example.demo.serviceimpl;

import com.example.demo.dao.StudentDao;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;

/*
 * StudentServiceImpl provides the implementation of the
 * StudentService interface.
 *
 * This class belongs to the Service Implementation layer.
 * It receives Student-related operations from the Controller
 * layer and delegates the required data-access operations
 * to StudentDao.
 *
 * The service layer acts as an intermediate layer between
 * the Controller and DAO layers.
 */
public class StudentServiceImpl implements StudentService {

	/*
	 * Reference to the StudentDao.
	 *
	 * This object will be used to delegate Student-related
	 * data-access operations to the DAO layer.
	 *
	 * The actual dependency configuration will be added
	 * when Spring/Hibernate integration is implemented.
	 */
	private StudentDao studentDao;


	/*
	 * Finds a Student using the student's unique ID.
	 *
	 * The student ID is passed to the DAO layer to retrieve
	 * the corresponding Student record.
	 *
	 * @param studentId unique ID / roll number of the student.
	 * @return the matching Student object.
	 */
	@Override
	public Student findByStudentId(String studentId) {

		return studentDao.findByStudentId(studentId);
	}

}