### Project Hierarchy
	src/main/java/com/yourproject/studentmanagement/
	│
	├── StudentManagementApplication.java
	│
	├── config/
	│   ├── SecurityConfig.java
	│   ├── JwtConfig.java
	│   └── RestClientConfig.java
	│
	├── controller/
	│   ├── AuthController.java
	│   ├── AdminController.java
	│   ├── FacultyController.java
	│   ├── StudentController.java
	│   │
	│   └── FacultyCaMarksController.java       ← YOUR OCR entry point
	│
	├── service/
	│   ├── AuthService.java
	│   ├── AdminService.java
	│   ├── FacultyService.java
	│   ├── StudentService.java
	│   │
	│   └── CaMarksOcrService.java              ← YOUR service interface
	│
	├── service/
	│   └── impl/
	│       ├── AuthServiceImpl.java
	│       ├── AdminServiceImpl.java
	│       ├── FacultyServiceImpl.java
	│       ├── StudentServiceImpl.java
	│       │
	│       └── CaMarksOcrServiceImpl.java      ← YOUR implementation
	│
	├── dao/
	│   ├── StudentDao.java
	│   ├── FacultyDao.java
	│   ├── MarksDao.java
	│   ├── SubjectDao.java
	│   │
	│   └── CaMarksOcrDao.java                  ← OCR staging data
	│
	├── dao/
	│   └── impl/
	│       ├── StudentDaoImpl.java
	│       ├── FacultyDaoImpl.java
	│       ├── MarksDaoImpl.java
	│       ├── SubjectDaoImpl.java
	│       │
	│       └── CaMarksOcrDaoImpl.java
	│
	├── model/
	│   ├── Student.java
	│   ├── Faculty.java
	│   ├── Subject.java
	│   ├── Marks.java
	│   │
	│   └── CaMarksOcrResult.java               ← OCR result/staging model
	│
	├── dto/
	│   ├── request/
	│   │   ├── LoginRequest.java
	│   │   └── CaMarksOcrRequest.java
	│   │
	│   └── response/
	│       ├── LoginResponse.java
	│       ├── CaMarksOcrResponse.java
	│       └── ApiResponse.java
	│
	├── client/
	│   └── OcrMicroserviceClient.java           ← Calls Python service
	│
	├── exception/
	│   ├── GlobalExceptionHandler.java
	│   ├── OcrServiceException.java
	│   └── FileValidationException.java
	│
	└── util/
	    ├── FileValidator.java
	    └── JwtUtil.java
	    
### Project GitHub Link
	https://github.com/Debastab0-2107/Student-Management_System
	
### admin credentials
	Body:
	{
    "username": "admin",
    "password": "admin123"
	}
	
### Update the FacultyServiceImpl.java [Priyanshu]
	I had modified the update() method of "FacultyServiceImpl.java" for uploading 	faculty records through admin's JWT token


### faculty[regular] upload(.xl) process through admin's JWT token [Priyanshu]
	POST:	http://localhost:8080/admin/faculty/regular/upload
	
### faculty[regular] de-activation process through admin's JWT token [Priyanshu]
	PUT:	http://localhost:8080/admin/faculty/regular/TEST_RF_2026_001/deactivate
	JSON Response:
	{
    	"teacherId": "TEST_RF_2026_001",
    	"status": false,
    	"message": "Regular faculty deactivated successfully"
	}
	
### Update AdminService.java and AdminServiceImple.java [Priyanshu]
	add the method in the interface and then implement the 	deactivateRegularFacultyById() method

### Add this deactivateRegularFacultyById in AdminController.java	[Priyanshu]
	
### faculty[visiting] upload process through admin's JWT token [Priyanshu]
	POST:	http://localhost:8080/admin/faculty/visiting
	Body → raw → JSON, containing teacherId, name, phoneNumber, and deptId.
	JSON Request Body:
	{
	  "teacherId": "TEST_VF_2026_003",
	  "name": "Test Visiting Faculty One",
	  "phoneNumber": "9000002003",
	  "facultyType": "VISITING",
	  "deptId": "MCA",
	  "status": true
	}

### faculty[visiting] de-activation process through admin's JWT token [Priyanshu]
	PUT:	http://localhost:8080/admin/faculty/visiting/TEST_VF_2026_004/deactivate

### Important: New regular faculty insertion rule	[Priyanshu]
	there is one distinction that is to be followed:
	when a new faculty arrives as a regular ones , if we want to add them with the 	existing (.xl) 	sheet then the records should be at 1st row, [XXX] don't put it at 	last or middle while 	uploading it through the JSON request
	

### Marks Upload of each student through Admin's token	[Priyanshu,20/10/2026]	
	##URL:
	POST:	http://localhost:8080/marks
	{
	    "marksId": "TEST_MARKS_001",
	    "studentId": "MCA2026001",
	    "subjectId": "MCAN-101",
	    "marks": 85.0
	}
	
### Marks review section	[Priyanshu]
	GET:	http://localhost:8080/marks/TEST_MARKS_001
	

###	Find out the active teachers	[Priyanshu]
	USE mca_student_management;
	SELECT teacher_id, name, faculty_type, status FROM faculty WHERE status = 1;
	
### Add the missing end-point through a controller class of teachers credentials	[Priyanshu]
	implement:
	TeacherCredentialController.java.

### Teacher Credentials through Admin's JWT token	[Priyanshu]
	POST:	http://localhost:8080/admin/teacher-credentials
	{
	  "teacherId": "TEST_RF_2026_002",
	  "initialPassword": "teacher@2026"
	}	
	
### Add teacher authorization file in Controller package	[Priyanshu]
	com.example.demo.Controller.TeacherAuthController.java 

### Teacher Login	[Priyanshu]
	POST:	http://localhost:8080/auth/teacher/login
	JSON request body:
	{
	  "teacherId": "TEST_RF_2026_002",
	  "password": "teacher@2026"
	}

### POST handler addition in MarksController.java	[Priyanshu]

### Update SecurityConfig.java	[Priyanshu]
	add annotation @EnableMethodSecurity
	
### Set MarksId in MarksController.java	[Priyanshu]
	marks.setMarksId(java.util.UUID.randomUUID().toString());
	
	
### Teacher upload numbers through his JWt login token (.xl)	[Priyanshu]
	key:			Type:		Value:
	file			File		.xlsx file
	semesterId		Text		real sem id
	

	