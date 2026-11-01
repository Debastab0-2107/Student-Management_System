## Authentication

- `POST http://localhost:8080/auth/login`
- `POST http://localhost:8080/auth/student/login` [student login]
- `POST http://localhost:8080/auth/teacher/login` [faculty login]

## Admin — Student & Faculty

- `POST http://localhost:8080/admin/students/upload`
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
- `http://localhost:8080/admin/password`

Select Bearer Token then paste token (obtained after Admin login).
Content-Type: application/json

json 
{
    "currentPassword": "admin_current_password",
    "newPassword": "admin_new_password"
}

## CA Marks

- `POST http://localhost:8080/ca-marks/upload/{semesterId}/{caCode}`

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

## Subject Management

- `POST http://localhost:8080/subject`
- `GET http://localhost:8080/subject`
- `GET http://localhost:8080/subject/{subjectId}`
- `PUT http://localhost:8080/subject/{subjectId}`
- `DELETE http://localhost:8080/subject/{subjectId}`

## Testing & Development

- `GET http://localhost:8080/test-env`
- `GET http://localhost:8080/git-test-friend1`

