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