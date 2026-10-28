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
