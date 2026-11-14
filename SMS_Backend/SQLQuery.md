### Mysql faculty table creation query [Priyanshu, 28/10/26]
	CREATE TABLE faculty (
	    teacher_id   VARCHAR(50)  NOT NULL,
	    name         VARCHAR(100) NOT NULL,
	    phone_number VARCHAR(20)  DEFAULT NULL,
	    faculty_type VARCHAR(30)  NOT NULL,
	    dept_id      VARCHAR(50)  DEFAULT NULL,
	    status       TINYINT(1)   NOT NULL DEFAULT 1,
	    PRIMARY KEY (teacher_id)
	);

### Mysql student table creation query [Priyanshu, 28/10/26]
	CREATE TABLE student (
    student_id           VARCHAR(50)  NOT NULL,
    name                 VARCHAR(100) NOT NULL,
    phone_number         VARCHAR(20)  DEFAULT NULL,
    email                VARCHAR(150) DEFAULT NULL,
    year_of_admission    VARCHAR(20)  DEFAULT NULL,
    date_of_birth        VARCHAR(30)  DEFAULT NULL,
    course_id            VARCHAR(50)  DEFAULT NULL,
    session_id           VARCHAR(50)  DEFAULT NULL,
    current_semester_id  VARCHAR(50)  DEFAULT NULL,
    password_hash        VARCHAR(255) DEFAULT NULL,
    must_change_password TINYINT(1)   NOT NULL DEFAULT 1,
    father_name          VARCHAR(100) NOT NULL DEFAULT '',
    father_phone_number  VARCHAR(20)  NOT NULL,
    mother_name          VARCHAR(100) NOT NULL DEFAULT '',
    mother_phone_number  VARCHAR(20)  NOT NULL,

    PRIMARY KEY (student_id)
	);

### Mysql subject table creation query [Priyanshu, 28/10/26]
	CREATE TABLE subject (
	    subject_id   VARCHAR(50)  NOT NULL,
	    subject_name VARCHAR(100) NOT NULL,
	    course_id    VARCHAR(50)  NULL DEFAULT NULL,
	    semester_id  VARCHAR(50)  NULL DEFAULT NULL,
	    PRIMARY KEY (subject_id)
	);

### Mysql CA Marks upload table creation query	[Priyanshu,20/10/2026]
	## SQL Query:
	USE mca_student_management;
	CREATE TABLE CA_MARKS (
	    marks_id    VARCHAR(50)  NOT NULL,
	    student_id  VARCHAR(50)  NOT NULL,
	    teacher_id  VARCHAR(50)  NOT NULL,
	    subject_id  VARCHAR(50)  NOT NULL,
	    total_marks DECIMAL(5,2) NOT NULL,
	    sem         VARCHAR(20)  NOT NULL,
	    ca_no       INT          NOT NULL,
    CONSTRAINT pk_ca_marks PRIMARY KEY (marks_id),
    CONSTRAINT chk_ca_marks_nonnegative CHECK (total_marks >= 0),
    CONSTRAINT chk_ca_marks_ca_no CHECK (ca_no > 0)
	);
	
### Mysql Teacher Credentials table creation query	[Priyanshu, 20/10/26]
	USE mca_student_management;
	
	CREATE TABLE teacher_credentials (
	    teacher_id VARCHAR(50) PRIMARY KEY,
	    password_hash VARCHAR(255) NOT NULL,
	    must_change_password TINYINT(1) NOT NULL DEFAULT 1,

    CONSTRAINT fk_teacher_credentials_faculty
        FOREIGN KEY (teacher_id)
        REFERENCES faculty(teacher_id)
	);
	
### Mysql Marks_ID_Sequence table creation query	[Priyanshu, 20/10/26]
	USE mca_student_management;	
	CREATE TABLE IF NOT EXISTS marks_id_sequence (
	    sequence_name VARCHAR(50) PRIMARY KEY,
	    next_value BIGINT NOT NULL
	);	
	INSERT INTO marks_id_sequence (sequence_name, next_value)
	VALUES ('TEST_MARKS', 2)
	ON DUPLICATE KEY UPDATE sequence_name = VALUES(sequence_name);
	
	SELECT * FROM marks_id_sequence;
	
### Mysql ADMIN_CREDENTIALS table creation query	[Priyanshu, 02/11/26]
	CREATE TABLE ADMIN_CREDENTIALS (
	    username VARCHAR(100) NOT NULL PRIMARY KEY,
	    password_hash VARCHAR(100) NOT NULL,
	    password_changed TINYINT(1) NOT NULL DEFAULT 0,
	    CONSTRAINT chk_admin_password_changed
	        CHECK (password_changed IN (0, 1))
	);

### MySql Student table update for student De-Activation :----- [Parambrata , 02/11/2026 at 17:33 pm]
		##Update Student Table:[run below SQL command]
		ALTER TABLE student ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
		
		
### MySql Student table semester_id will now start from 1 :----- [Debastab , 02/11/2026 at 7:58 pm]		
		ALTER TABLE student MODIFY COLUMN current_semester_id VARCHAR(50) DEFAULT '1';
		
### MySql Subject table field addition for active/inactive subjects	[Priyanshu, 06/11/26, 03:16am, 07/11/26, 02:55am]
	USE mca_student_management;
	ALTER TABLE subject ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;
	
### Verify the Student table
	SELECT student_id, name, is_active FROM student;

### CA Number field Removal [Priyanshu, 07/11/26, 04:30am]
	ALTER TABLE ca_marks DROP COLUMN ca_no, ADD CONSTRAINT uq_ca_marks_student_subject_sem
    UNIQUE (student_id, subject_id, sem);
    
### [Debastab, 08/11/26, 10:50am] changing the faculty table in sql
	ALTER TABLE faculty
    ADD COLUMN alternate_phone_number VARCHAR(20) NULL,
    ADD COLUMN educational_details TEXT NULL,
    ADD COLUMN email VARCHAR(150) NULL;	
    
    DESC faculty;
    
## [Parambrata, 08/11/2026 , 07:26 pm] add roll and reg no field in student table and make them unique field
	ALTER TABLE student
	ADD COLUMN university_roll_no VARCHAR(50) NULL,
	ADD COLUMN university_registration_no VARCHAR(100) NULL;
	
	//For making them unique field run below queries:----
	CREATE UNIQUE INDEX uk_student_university_roll
	ON student(university_roll_no);

	CREATE UNIQUE INDEX uk_student_university_reg
	ON student(university_registration_no);
   
### First 5rows of table [Priyanshu, 10/11/26, 05:30am]
	SELECT * FROM student LIMIT 5;
	SELECT * FROM subject LIMIT 5;
	
### Student table view [Priyanshu, 10/11/26, 08:00pm]
	SELECT student_id, name, current_semester_id, is_active FROM student WHERE session_id = '2026-28' 	AND course_id = 'MCA' ORDER BY student_id;
	
### Entire Batch Status [Priyanshu, 10/11/26, 08:12pm]
	SELECT    current_semester_id,    is_active,    COUNT(*) AS total_students FROM student 	WHERE 	session_id = '2026-28'  AND course_id = 'MCA' GROUP BY current_semester_id, 	is_active ORDER BY 	current_semester_id, is_active;
	+---------------------+-----------+----------------+
	| current_semester_id | is_active | total_students |
	+---------------------+-----------+----------------+
	| 2                   |         0 |              1 |
	| 5                   |         1 |             24 |
	+---------------------+-----------+----------------+
	
### batch de-activation 
	SELECT    student_id,    name,    session_id,    course_id,    current_semester_id,    	is_active FROM student WHERE session_id = '2026-28'  AND course_id = 'MCA'  AND 	current_semester_id = '4'  AND is_active = 1;
	Result: Empty set (0.05 sec)
	
### Select five randomly deactivated students [Priyanshu, 10/11/26, 08:59pm]
	SELECT student_id, is_active FROM student WHERE session_id = '2026-28' AND course_id = 	'MCA' AND current_semester_id = '4' AND is_active = 0 ORDER BY RAND() LIMIT 5;
	

### MySql subject_teacher_assignment table Creation [Priyanshu, 14/11/26, 03:30pm]
	CREATE TABLE subject_teacher_assignment (
    teacher_id VARCHAR(50) NOT NULL,
    subject_id VARCHAR(50) NOT NULL,
    session_id VARCHAR(50) NOT NULL,

    is_active TINYINT(1) NOT NULL DEFAULT 1,

    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (teacher_id, subject_id, session_id),

    INDEX idx_assignment_subject_session
        (subject_id, session_id, is_active),

    CONSTRAINT fk_assignment_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES faculty(teacher_id),

    CONSTRAINT fk_assignment_subject
        FOREIGN KEY (subject_id)
        REFERENCES subject(subject_id)

	) ENGINE=InnoDB
	  DEFAULT CHARSET=utf8mb4
	  COLLATE=utf8mb4_0900_ai_ci;
	  
### Students table view [Priyanshu, 14/11/26, 06:30pm]
	SELECT    session_id,    course_id,    current_semester_id,    is_active,    COUNT(*) AS total_students FROM student WHERE session_id = '2026-28'  AND course_id = 'MCA' GROUP BY    session_id,    course_id,    current_semester_id,    is_active ORDER BY current_semester_id, is_active;