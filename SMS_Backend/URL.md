## Authentication

- `POST http://localhost:8080/auth/login` [admin login]
- `POST http://localhost:8080/auth/student/login` [student login]
- `POST http://localhost:8080/auth/teacher/login` [faculty login]

## Admin — Student & Faculty

- `POST http://localhost:8080/admin/students/upload`
- `GET http://localhost:8080/admin/students`

- `POST http://localhost:8080/admin/faculty/regular/upload`
- `POST http://localhost:8080/admin/faculty/regular/deactivate`
- `PUT http://localhost:8080/admin/faculty/regular/{teacherId}/deactivate`
- `POST http://localhost:8080/admin/faculty/visiting`
- `GET http://localhost:8080/admin/faculty`
- `GET http://localhost:8080/admin/faculty/{teacherId}`
- `PUT http://localhost:8080/admin/faculty/visiting/{teacherId}`
- `PUT http://localhost:8080/admin/faculty/visiting/{teacherId}/deactivate`
- `POST http://localhost:8080/admin/teacher-credentials`

## Admin Password Changing URL:---------------

- `PUT http://localhost:8080/admin/password`

## CA Marks Uploaded by Teacher

- `POST http://localhost:8080/ca-marks/upload/{semesterId}/{caCode}`

### Semester Marks Uploaded by Teacher
	GET /faculty/students/{studentId}/semester-results
	
### Teacher can see student details(basics, CA-Marks, Semester marks)	[Priyanshu, 07/11/2026, 03:29am-4:00am]
-	`GET http://localhost:8080/faculty/students`
-	`GET http://localhost:8080/faculty/ca-marks`
-	`GET http://localhost:8080/faculty/students/MCA2026001/ca-marks`
-	`GET http://localhost:8080/faculty/ca-marks/semester/SEM1`
 
## Marks Management

- `POST http://localhost:8080/marks`
- `GET http://localhost:8080/marks`
- `GET http://localhost:8080/marks/{marksId}`
- `PUT http://localhost:8080/marks/{marksId}`
- `DELETE http://localhost:8080/marks/{marksId}`
- `POST http://localhost:8080/marks/upload`

## Student

- `GET http://localhost:8080/student/profile`
- `PUT http://localhost:8080/student/profile`
- `PUT http://localhost:8080/student/password`
- `GEt http://localhost:8080/student/ca-marks`

## Subject Management

- `POST http://localhost:8080/admin/subjects/upload`
- `GET http://localhost:8080/subject`
- `GET http://localhost:8080/subject/MCAN-103`
- `GEt http://localhost:8080/subject/course/MCA/semester-wise`
- `POST http://localhost:8080/admin/subjects/update-upload`
- `POST http://localhost:8080/admin/subjects/deactivate-upload`
- `DELETE http://localhost:8080/subject/MCAN-101`	[without xlsx fle]

## Testing & Development

- `GET http://localhost:8080/test-env`
- `GET http://localhost:8080/git-test-friend1`

##De-activation of student by Admin
	Admin should login first then by using JWT token run below url
-	`PUT/POST http://localhost:8080/admin/students/MCA2026007/deactivate`


