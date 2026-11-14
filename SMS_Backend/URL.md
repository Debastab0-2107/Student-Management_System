# Student Management System — API Endpoint's Reference

**Base URL:** `http://localhost:8080`

========================================================================================

## Authentication

- `POST http://localhost:8080/auth/login` — Admin's login
- `POST http://localhost:8080/auth/student/login` — Student login
- `POST http://localhost:8080/auth/teacher/login` — Faculty login

## Admin's — Student & Faculty

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

## Admin's Password Changing URL

- `PUT http://localhost:8080/admin/password`

## CA Marks Uploaded by Teacher

- `POST http://localhost:8080/ca-marks/upload/{semesterId}`

## Semester Marks Uploaded by Teacher

- `GET http://localhost:8080/faculty/students/{studentId}/semester-results`

## Teacher — Student Details and Marks

- `GET http://localhost:8080/faculty/students` — View student details
- `GET http://localhost:8080/faculty/ca-marks` — View CA marks
- `GET http://localhost:8080/faculty/students/MCA2026001/ca-marks` — View CA marks for a specific student
- `GET http://localhost:8080/faculty/ca-marks/semester/SEM1` — View CA marks by semester

## Teacher — Profile Management

- `GET http://localhost:8080/faculty/profile` — Get the logged-in teacher's profile  
  **Added:** 08/11/2026, 11:36 AM IST
- `PUT http://localhost:8080/faculty/profile` — Update the logged-in teacher's profile  
  **Added:** 08/11/2026, 11:36 AM IST
- `PUT http://localhost:8080/faculty/password` — Change the logged-in teacher's password  
  **Added:** 08/11/2026, 11:36 AM IST

> **Authentication:** These teacher profile and password end points require the logged-in teacher's JWT token. In Thunder Client, add the header `Authorization: Bearer YOUR_TEACHER_TOKEN`.

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
- `GET http://localhost:8080/student/ca-marks`

## Subject Management

- `POST http://localhost:8080/admin/subjects/upload`
- `GET http://localhost:8080/subject`
- `GET http://localhost:8080/subject/MCAN-103`
- `GET http://localhost:8080/subject/course/MCA/semester-wise`
- `POST http://localhost:8080/admin/subjects/update-upload`
- `POST http://localhost:8080/admin/subjects/deactivate-upload`
- `DELETE http://localhost:8080/subject/MCAN-101` — Delete without an XLSX file

## Testing & Development

- `GET http://localhost:8080/test-env`
- `GET http://localhost:8080/git-test-friend1`

## Student De-Activation by Admin's
- `PUT http://localhost:8080/admin/students/MCA2026007/deactivate`

**Note:** Replace example IDs such as `MCA2026001`, `MCA2026007`, `SEM1`, and `MCAN-103` with the required IDs when testing other records.

## University Roll and Registration No. Excel file uploaded by admin's side
- `POST http://localhost:8080/admin/students/university-identifiers/upload`

### Batch Promotion by Admin's Token
- `PUT http://localhost:8080/admin/students/promote-batch`

## Batch De-Activation by Admin's Token 
- `PUT http://localhost:8080/admin/students/deactivate-batch`

### Teacher-Subject assign by Admin's Token
- `POST http://localhost:8080/api/admin/upload/assignments`

