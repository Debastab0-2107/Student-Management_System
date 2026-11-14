1. Your project has two major parts:
Part 1
	`Frontend — React`
		->
		<-
	`HTTP requests and responses (Axios + REST API)`
	`Frontend communicates with backend`

Part 2
	
	Backend — Java Spring Boot
	Processes requests, applies rules, checks permissions and accesses data
	1. Controller
	2.Service Interface
	3. Service Implementation
	4. DAO Interface
	5. DAO Implementation
	6. Model / Hibernate
	7. MySQL Database[Stores students, faculty, subjects, marks, sessions, etc.]
	
The most important thing to remember:
	
	React never directly communicates with MySQL.
	React communicates with Spring Boot. Spring Boot communicates with MySQL.

2. Backend: What does every class do?
	
	An Admin wants to deactivate a student.
A. Controller — receives the request

	Example: AdminController.java
	Think of the Controller as the reception desk.
	It receives a request from the frontend and decides which service operation should handle it.
	For example:
	@PutMapping("/students/{studentId}/deactivate")
	public ResponseEntity<?> deactivateStudent(
	        @PathVariable String studentId) {
	
	    boolean result =
	        adminService.deactivateStudent(studentId);
	
	    return ResponseEntity.ok(result);
	}
	What happens?
		1. React sends a request.
		2. AdminController receives it.
		3. It extracts the student ID.
		4. It calls AdminService.
		5. It sends the result back to React.
	Controller does not decide how to deactivate a student. That is the Service's responsibility.
B. Service Interface — defines available operations

	Example: StudentService.java
	Think of this as a list of available services.
	public interface StudentService {
	    Student findByStudentId(String studentId);
	    List<Student> findAll();
	    boolean deactivateStudent(String studentId);
	    int deactivateBatch(
	        String sessionId,
	        String courseId,
	        String semesterId
	    );
	    boolean isStudentActive(String studentId);
	}
	It declares what operations are available, but does not explain how they work.
C. Service Implementation — applies business logic

	Example: StudentServiceImpl.java
	This is the decision-making layer.
	Suppose an Admin tries to deactivate a batch.
	The service can:
		1. Check whether session ID is provided.
		2. Check whether course ID is provided.
		3. Validate the semester.
		4. Check that the selected semester is the final MCA semester.
		5. Call the DAO to perform the operation.
	Example:
	@Override
	@Transactional
	public int deactivateBatch(
	        String sessionId,
	        String courseId,
	        String semesterId) {
	    // Validate the supplied information.
	    // Apply business rules.
	    return studentDao.deactivateBatch(
	        sessionId,
	        courseId,
	        semesterId
	    );
	}
	Remember: Service implementation contains business rules, not SQL/HQL, according to your 	project's strict architecture.
D. DAO Interface — defines database operations

	Example: StudentDao.java
	Think of this as a list of database operations.	
	public interface StudentDao {
	    Student findByStudentId(String studentId);
	    List<Student> findAll();
	    int deactivateBatch(
	        String sessionId,
	        String courseId,
	        String semesterId
	    );
	}
	It declares which database operations are available.
E. DAO Implementation — communicates with MySQL

	Example: StudentDaoImpl.java
	This is where Hibernate queries actually execute.
	Example:
	@Override
	public int deactivateBatch(
	        String sessionId,
	        String courseId,
	        String semesterId) {
	    String hql =
	        "UPDATE Student s " +
	        "SET s.active = false " +
	        "WHERE s.sessionId = :sessionId " +
	        "AND s.courseId = :courseId " +
	        "AND s.currentSemesterId = :semesterId " +
	        "AND s.active = true";
	    return sessionFactory
	        .getCurrentSession()
	        .createQuery(hql)
	        .setParameter("sessionId", sessionId)
	        .setParameter("courseId", courseId)
	        .setParameter("semesterId", semesterId)
	        .executeUpdate();
	}
	This is the actual database operation.
F. Model — represents a database record
	
	Example: Student.java
	Think of the Model as the Java representation of one student record.
	For example:
	public class Student {
	    private String studentId;
	    private String name;
	    private String email;
	    private String courseId;
	    private String sessionId;
	    private String currentSemesterId;
	    private boolean active;
	    public boolean isActive() {
	        return active;
	    }
	}
	A Student object represents one student.
	For example:
	studentId: MCA001
	name: Rahul
	courseId: MCA
	sessionId: 2026-28
	currentSemesterId: 4
	active: false
	
	Hibernate maps this Java object to the MySQL student table through your existing mapping 	configuration.
G. DTO — transfers information between frontend and backend

	Example: BatchDeactivationRequest.java
	DTO means Data Transfer Object.
	Suppose React sends:
	{
	    "sessionId": "2026-28",
	    "courseId": "MCA",
	    "semesterId": "4"
	}
	Spring Boot converts this JSON into a Java object:
	BatchDeactivationRequest request
	The controller then passes the values to the service.
	DTOs are useful because the frontend does not need to send an entire database entity when only 	three fields are required.
H. Other important classes

	Class:						Simple responsibility:
	AuthController				Receives login requests
	AuthServiceImpl				Verifies credentials and handles authentication
	JwtUtil						Generates and validates JWT tokens
	JwtAuthenticationFilter		Checks JWT on protected requests
	SecurityConfig				Defines which users can access which endpoints
	HibernateConfig				Configures Hibernate and SessionFactory
	GlobalExceptionHandler		Converts application errors into API responses
	ExcelParserUtil				Reads Excel files
	ExcelWriterUtil				Generates Excel files

3. Frontend to backend connection — how does it actually happen?
	
	The frontend might contain these files:
	React file:				Responsibility:
	Login.jsx				Displays the login page
	AuthContext.jsx			Maintains logged-in user information
	ProtectedRoute.jsx		Restricts pages based on roles
	axiosInstance.js		Connects React to backend APIs
	AdminDashboard.jsx		Displays Admin dashboard
	StudentList.jsx			Displays student records
	StudentUpload.jsx		Uploads Excel files
	FacultyDashboard.jsx	Displays Faculty dashboard
	StudentDashboard.jsx	Displays Student dashboard
	
	These are illustrative frontend filenames; the exact names depend on your frontend 	implementation.
	Example: Admin opens the Student List
	The process is:
		1. StudentList.jsx[Admin opens the Student List page.]
		2. axiosInstance.js[React sends a GET request with the JWT token.]
		3. AdminController.java[Receives GET /admin/students.]
		4. StudentServiceImpl.java[Calls findAll().]
		5. StudentDaoImpl.java[Retrieves records from MySQL using Hibernate.]
		6. MySQL[Returns student records.]
		7. React[Displays the received JSON data in the student table.]
	The response might look like:
	[
	    {
	        "studentId": "MCA001",
	        "name": "Rahul",
	        "courseId": "MCA",
	        "sessionId": "2026-28",
	        "currentSemesterId": "4",
	        "active": true
	    }
	]
	React uses these values to display the table.

4. What does each user do in the Student Management System?

	This is particularly important because Admin, Faculty and Students have different responsibilities.
A. Admin module

	The Admin is responsible for managing the institution's academic data.
	Operation					What Admin does					What backend does
	Student upload				Uploads student Excel			Parses, validates and inserts student records
	Faculty upload				Uploads faculty Excel			Creates faculty records and credentials
	Student list				Views all students				Retrieves student information
	Student deactivation		Deactivates an account			Sets is_active = 0
	Batch promotion				Promotes students				Updates current_semester_id
	Batch deactivation			Deactivates completed batch		Updates active status for matching students
	Subject management			Adds or updates subjects		Stores subject master data
	Faculty assignment			Assigns subjects to faculty		Creates teacher-subject mapping
	University identifiers	Uploads university roll/registration data	Updates student identifiers
	Notices						Publishes notices				Stores notices for appropriate users

	Example: Admin uploads students
	Admin selects students.xlsx
	          ↓
	React sends multipart/form-data
	          ↓
	AdminController
	          ↓
	StudentServiceImpl
	          ↓
	ExcelParserUtil
	          ↓
	StudentDaoImpl
	          ↓
	MySQL student table
	          ↓
	Response returned to React
	          ↓
	Admin sees upload summary

	The Excel file is not directly inserted into MySQL. It is first read, validated and converted into Java 	Student objects.
B. Faculty module
	
	Faculty members mainly handle academic activities.
	Operation:			What Faculty does:					What backend does:
	Login				Enters credentials					Authenticates faculty
	View subjects		Opens assigned subjects				Finds subjects assigned to that faculty
	View student list	Selects a subject					Retrieves eligible students
	Enter CA marks		Enters internal assessment marks	Validates and stores marks
	Update marks		Corrects marks						Updates existing marks
	Export marks		Downloads Excel						Generates an Excel file
	View notices		Opens notices						Returns notices visible to faculty

	Example: Faculty enters CA marks
	Faculty opens assigned subject
	          ↓
	React requests subject roster
	          ↓
	FacultyController
	          ↓
	FacultyService
	          ↓
	Checks teacher-subject assignment
	          ↓
	StudentDao retrieves eligible students
	          ↓
	React displays student table
	          ↓
	Faculty enters marks
	          ↓
	React sends marks JSON
	          ↓
	FacultyController
	          ↓
	MarksServiceImpl
	          ↓
	Checks whether faculty is assigned
	          ↓
	MarksDaoImpl
          ↓
	MySQL marks table
	
	Important: Faculty should only be able to enter marks for subjects assigned to them. The backend must 	enforce this, even if the frontend hides unauthorized subjects.
C. Student module

	Students mainly view their own academic information.
	Operation:			What Student does:			What backend does:
	Login				Enters credentials			Verifies account and password
	View profile		Opens profile				Retrieves their own information
	Update profile		Updates editable details	Validates and saves allowed fields
	Change password		Changes password			Verifies old password and hashes new one
	View marks			Opens results				Retrieves their own marks
	Export marks		Downloads mark sheet		Generates personal Excel file
	View notices		Opens notice board			Returns notices visible to students

	A student must not be able to change the student ID in an API request to access another student's marks.
	The backend should derive the authenticated student's identity from their JWT.

5. Understand one complete operation from beginning to end

	Admin clicks Deactivate Batch in React.
		Stage:	File/class:					What happens:
		1		Admin UI					Admin selects session, course and semester
		2		Axios						Sends PUT request
		3		AdminController				Receives the request
		4		BatchDeactivationRequest	Holds the three request values
		5		StudentService				Declares the operation
		6		StudentServiceImpl			Validates semester and input
		7		StudentDao					Declares database operation
		8		StudentDaoImpl				Executes Hibernate HQL update
		9		Student						Represents student data and active status
		10		MySQL						Saves the inactive status
		11		React						Displays success message and updated list
	That is the entire journey of one operation.
	The same architecture is reused for student uploads, subject assignments, marks entry and many other 	features.
	
6. How to remember the whole project

	Here is the easiest way to remember each class:
	Class/layer:			Remember it as:
	React component			What the user sees
	Axios					Messenger between frontend and backend
	Controller				Reception desk
	DTO						Request/response envelope
	Service interface		List of available operations
	Service implementation	Decision maker
	DAO interface			Database operation contract
	DAO implementation		Database operator
	Model					Representation of a record
	Hibernate				Java-to-database translator
	MySQL					Permanent storage
	JWT						Digital identity pass
	Security configuration	Access-control rules