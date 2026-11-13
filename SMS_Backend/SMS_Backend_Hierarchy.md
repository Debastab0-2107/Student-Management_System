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
	
### New table creation for admin password changes	[Priyanshu, 02/11/26]
	  Select Bearer Token then paste token (obtained after Admin login).

### Admin Password Changing [Priyanshu, 02/11/26]
	JSON request body:
	{
	    "currentPassword": "admin_current_password",
	    "newPassword": "admin_new_password"
	}
	
### Admin NEW Password	[Priyanshu, 02/11/26]
	username: admin
	old password: admin123
	new password: admin456
	
### Student successfully seen the Ca marks
	[
	    {
	        "marksId": "TEST_MARKS_001",
	        "subjectId": "MCAN-101",
	        "totalMarks": 24.50,
	        "sem": "SEM1",
	        "caNo": 1
	    }
	]
	
##UPDATED CLASS for student De-Activation:--
		[Student.java,Student.hbm.xml,StudentDao.java,StudentDaoImpl.java,StudentService.java,StudentServiceImpl.java,AdminService.java,AdminServiceImpl.java,AdminController.java, AuthServiceImpl.java,JwtAuthenticationFilter.java
		Create a class :PasswordEncoderConfig and Modify SecurityConfig.java]
		
##UPDATED the AdminController for getting the list of students and getting semester id in frontend :-- Debastab 
		AdminController.java ( method name : getAllStudents())----2nd nov 7.08pm
		Student.java ( added attribute SemesterId and getter and setter )---- 2nd nov 8pm
		Student.hbm.xml ( added a property in line 101 -106 )---- 2nd nov 8pm
		StudentServiceImpl.java ( added line 141 - 147 )---- 2nd nov 8pm
		/StudentController.java (line 254, ) ---- 2nd nov 8pm
		
### Changes for doing (admin Subject upload through (.xlxs) file not using his own JWT token)	[Priyanshu, 05/11/26, 03:36am]
	1.	Update SubjectController.java [3 mapping added for 3 CRUD methods]
	2. Make another xl file containing subject details for upload
	3. Create SubjectExcelRow.java
	4. Create SubjectExcelParser.java
	5.	Update SubjectDao.java and Update SubjectDaoImpl.java
	6.	Update SubjectService.java and Update SubjectServiceImpl.java
	7. Update AdminController.java
	
### Faculty can view all student details
	1. Create FacultyStudentResponse.java
	2. Create FacultyStudentService.java
	3. Create FacultyStudentServiceImpl.java
	4. Create FacultyStudentController.java
	5. Update SecurityConfig.java
	
### Testing of Subjects uploaded through admins JWt token in xl file [Priyanshu, 06/11/26, 02:50am]
	 1. just admin login 
	 2. then by using his token, he can upload the subject (.xl) file to the existing db table of subject

### One field added in Subject table for maintaining active/inactive subject status
	is_active(0,1)
	
### Subject module updated	[Priyanshu, 06/11/26, 03:50am]
	1. Subject.java
	2. Subject.hbm.xml[Update Hibernate mapping]
	3. SubjectService.java
	4. SubjectServiceImpl.java
	5. SubjectController.java
	6. AdminController.java
	7. SubjectExcelParser.java
	8. SubjectDao.java
	9. SubjectDaoImpl.java
	
### Subject CRUD[By Admin] Integration Testing is done [Priyanshu, 06/11/26, 04:15am]

### One field added in Student table for maintaining active/inactive subject status [Priyanshu, 07/11/26, 02:55am]
	is_active(0,1) 

### Faculty should be able to open a student's details and see their CA marks semester-wise and subject-wise.	[Priyanshu, 07/11/26, 03:45am]
	1. FacultyStudentController.java
	2. CAMarksDao.java
	3. CAMarksDaoImpl.java
	4. CAMarksService.java
	5. CAMarksServiceImpl.java
	6. FacultyCAMarksController.java

### There is only one CA, no CA classifications(CA1, CA2...) needed [Priyanshu, 07/11/26, 04:30am]
	Path: src/main/java/com/example/demo/model/CAMarks.java
	Path: src/main/resources/CAMarks.hbm.xml
	Path: src/main/java/com/example/demo/dao/CAMarksDao.java
	Path: src/main/java/com/example/demo/daoimpl/CAMarksDaoImpl.java
	Path: src/main/java/com/example/demo/service/CAMarksService.java
	Path: src/main/java/com/example/demo/serviceimpl/CAMarksServiceImpl.java
	Path: src/main/java/com/example/demo/Controller/CAMarksController.java
	Path: src/main/java/com/example/demo/Controller/FacultyStudentController.java
	Path: src/main/java/com/example/demo/Controller/FacultyCAMarksController.java
	Path: src/main/java/com/example/demo/Controller/StudentController.java
	
### Resolve Subject model related class problems [Priyanshu, 07/11/26, 01:00pm]
	SubjectDaoImpl.java
	SubjectController.java
	SubjectDao.java
	
### Testing of the above Solved Problem	[Priyanshu, 07/11/26, 03:00pm]
	Through URLs for checking de-activation and updation 
	
	
### Changing the faculty files for extra features for three fields alternate pg, email, educational details	[Debastab, 08/11/26, 10.59am]
	File path:src/main/java/com/example/demo/model/Faculty.java
	File path:src/main/resources/Faculty.hbm.xml
	File path:src/main/java/com/example/demo/dao/FacultyDao.java--updateprofile() method added
	File path:src/main/java/com/example/demo/daoimpl/FacultyDaoImpl.java--updateprofile() method added
	File path:src/main/java/com/example/demo/service/FacultyService.java---updatePRofile() method added
	File path:src/main/java/com/example/demo/serviceimpl/FacultyServiceImpl.java---updatePRofile() method added
	** CREATED: File path: src/main/java/com/example/demo/Controller/TeacherProfileController.java
	** CREATED: File path: src/main/java/com/example/demo/Controller/TeacherCredentialController.java
	

### Changing the following classes for the direct credential entry of faculty	[Debastab, 10/11/26, 10.59am]
	File path:src/main/java/com/example/demo/dao/FacultyDao.java ---added a method: Faculty saveWithCredentials()
	File path: src/main/java/com/example/demo/daoimpl/FacultyDaoImpl.java----addea a method : Faculty saveWithCredentials()
	File path:src/main/java/com/example/demo/serviceimpl/FacultyServiceImpl.java
### Profile updation for individual faculty	[Priyanshu, 10/11/26, 04:31pm]
	JSON Body:
	{
	    "teacherId" : "TEST_RF_2026_004",
	    "name": "Test Regular Faculty Four",
	    "phoneNumber": "9000001004",
	    "alternatePhoneNumber" : "7984568295",
	    "email": "teacher@example.com",
	    "educationalDetails": "MCA, PhD",
	    "facultyType": "REGULAR"
	}
	
###  Batch promotion [Priyanshu, 10/11/26, 06:52pm]
	1. Add the promotion request DTO class  BatchPromotionRequest.java
	2. Update StudentDao.java
	3. Update StudentDaoImpl.java
	4. Update StudentService.java
	5. Update StudentServiceImpl.java
	6. Update AdminService.java
	7. Update AdminServiceImpl.java
	8. Update AdminController.java
	
### Required 
	Content-Type: application/json
	Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
	JSOn Body:
	{
    	"sessionId": "2026-28",
    	"courseId": "MCA",
    	"currentSemesterId": "1" //2,3,4
	}


### Student Login Body [Priyanshu, 10/11/26, 07:56pm]
	{
	    "studentId": "MCA2026003",
	    "password": "student@26"
	}
	
### Batch De-activation [Priyanshu, 10/11/26, 08:48pm]
	1. Create the request DTO BatchDeactivationRequest.java
	2. Update StudentService.java
	3. Update StudentDao.java
	4. Update StudentDaoImpl.java
	5. Update StudentServiceImpl.java
	6. Update AdminController.java
	
### Batch De-activation JSON Body [Priyanshu, 10/11/26, 08:50pm]
	Content-Type: application/json
	Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
	{
    "sessionId": "2026-28",
    "courseId": "MCA",
    "semesterId": "4"
	}
	
