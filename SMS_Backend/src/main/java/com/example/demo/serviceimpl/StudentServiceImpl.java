package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.StudentDao;
import com.example.demo.dto.request.UniversityIdentifierExcelRow;
import com.example.demo.model.Student;
import com.example.demo.service.StudentService;

/**
 * StudentServiceImpl
 *
 * Implements the business logic for student operations.
 *
 * Responsibilities:
 * - Create students imported from the authority Excel sheet.
 * - Validate duplicate student IDs.
 * - Handle student lookup.
 * - Update only student-editable profile fields.
 * - Verify the current password before allowing a password change.
 * - BCrypt-hash the new password before sending it to the DAO.
 *
 * Authority-controlled fields are never changed through the
 * student profile update operation:
 *
 * - studentId
 * - name
 * - phoneNumber
 * - courseId
 * - sessionId
 *
 * Student-editable fields are:
 *
 * - email
 * - dateOfBirth
 * - fatherName
 * - fatherPhoneNumber
 * - motherName
 * - motherPhoneNumber
 * - password
 */
@Service
public class StudentServiceImpl implements StudentService {

    /*
     * DAO responsible for Hibernate database operations.
     */
    private final StudentDao studentDao;

    /*
     * Spring Security password encoder used for BCrypt hashing
     * and password verification.
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates the StudentServiceImpl.
     *
     * @param studentDao Student DAO implementation
     * @param passwordEncoder BCrypt password encoder
     */
    public StudentServiceImpl(
            StudentDao studentDao,
            PasswordEncoder passwordEncoder) {

        this.studentDao = studentDao;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new student.
     *
     * The initial password is the student's contact number.
     *
     * The contact number itself is never stored as the password.
     * Instead, it is BCrypt-hashed before being saved.
     *
     * Student-editable fields are initialized to empty strings
     * when they have not been supplied by the import process.
     *
     * The student is marked as requiring a password change after
     * the initial login.
     *
     * @param student student information from the Excel import process
     * @return newly created student
     */
    @Override
    @Transactional
    public Student createStudent(Student student) {

        if (student == null) {
            throw new IllegalArgumentException(
                    "Student data cannot be null");
        }

        /*
         * Validate the authority-controlled student ID.
         */
        if (isBlank(student.getStudentId())) {
            throw new IllegalArgumentException(
                    "Student ID cannot be empty");
        }

        /*
         * Validate the authority-controlled name.
         */
        if (isBlank(student.getName())) {
            throw new IllegalArgumentException(
                    "Student name cannot be empty");
        }

        /*
         * Validate the authority-controlled phone number.
         *
         * The phone number is also the initial password.
         */
        if (isBlank(student.getPhoneNumber())) {
            throw new IllegalArgumentException(
                    "Student phone number cannot be empty");
        }

        /*
         * Validate the authority-controlled course.
         */
        if (isBlank(student.getCourseId())) {
            throw new IllegalArgumentException(
                    "Student course ID cannot be empty");
        }

        /*
         * Validate the authority-controlled academic session.
         */
        if (isBlank(student.getSessionId())) {
            throw new IllegalArgumentException(
                    "Student session ID cannot be empty");
        }

        /*
         * Assign semester 1 when the Excel import
         * does not provide a semester ID.
         */
        if (isBlank(student.getCurrentSemesterId())) {
            student.setCurrentSemesterId("1");
        }
        
        /*
         * Do not allow duplicate authority-assigned student IDs.
         */
        if (studentDao.existsByStudentId(student)) {
            throw new IllegalArgumentException(
                    "Student with ID "
                            + student.getStudentId()
                            + " already exists");
        }

        /*
         * The authority Excel import does not provide the student's
         * initial password separately.
         *
         *  student@26 is the initial password for all the students.
         */
        String initialPassword = "student@26";

        /*
         * Convert the initial password into a BCrypt hash.
         *
         * Only this hash is stored in the database.
         */
        String passwordHash =
                passwordEncoder.encode(initialPassword);

        student.setPasswordHash(passwordHash);

        /*
         * Force student-editable fields to empty strings when the
         * imported value is missing.
         */
        student.setEmail(emptyIfNull(student.getEmail()));
        student.setDateOfBirth(
                emptyIfNull(student.getDateOfBirth()));
        student.setFatherName(
                emptyIfNull(student.getFatherName()));
        student.setFatherPhoneNumber(
                emptyIfNull(student.getFatherPhoneNumber()));
        student.setMotherName(
                emptyIfNull(student.getMotherName()));
        student.setMotherPhoneNumber(
                emptyIfNull(student.getMotherPhoneNumber()));

        /*
         * A newly imported student must change the initial
         * phone-number password after first login.
         */
        student.setMustChangePassword(true);
        
        student.setActive(true);

        /*
         * Save the fully prepared student.
         */
        return studentDao.save(student);
        
        
    }

    /**
     * Finds a student by authority-assigned student ID.
     *
     * @param studentId student ID
     * @return matching student, or null when not found
     */
    @Override
    @Transactional(readOnly = true)
    public Student findByStudentId(String studentId) {

        if (isBlank(studentId)) {
            return null;
        }
        Student student = new Student();
        student.setStudentId(studentId);

        return studentDao.findByStudentId(student);
    }

    /**
     * Checks whether a student exists.
     *
     * @param studentId student ID
     * @return true if the student exists
     */
    @Override
    @Transactional(readOnly = true)
    public boolean existsByStudentId(String studentId) {

        if (isBlank(studentId)) {
            return false;
        }
        Student student = new Student();
        student.setStudentId(studentId);
        return studentDao.existsByStudentId(student);
    }

    /**
     * Retrieves all students.
     *
     * @return list of all students
     */
    @Override
    @Transactional(readOnly = true)
    public List<Student> findAll() {

        return studentDao.findAll();
    }

    /**
     * Updates only the fields that the student is allowed to edit.
     *
     * The authority-controlled fields are not accepted by this
     * method and therefore cannot be changed through this operation.
     *
     * @param studentId authority-assigned student ID
     * @param email student's email
     * @param dateOfBirth student's date of birth
     * @param fatherName father's name
     * @param fatherPhoneNumber father's phone number
     * @param motherName mother's name
     * @param motherPhoneNumber mother's phone number
     * @return true if the profile was updated
     */
    @Override
    @Transactional
    public boolean updateStudentProfile(
            String studentId,
            String email,
            String dateOfBirth,
            String fatherName,
            String fatherPhoneNumber,
            String motherName,
            String motherPhoneNumber) {

        if (isBlank(studentId)) {
            throw new IllegalArgumentException(
                    "Student ID cannot be empty");
        }

        /*
         * Convert null values to empty strings so the database
         * consistently stores the editable fields as strings.
         */
        email = emptyIfNull(email);
        dateOfBirth = emptyIfNull(dateOfBirth);
        fatherName = emptyIfNull(fatherName);
        fatherPhoneNumber = emptyIfNull(fatherPhoneNumber);
        motherName = emptyIfNull(motherName);
        motherPhoneNumber = emptyIfNull(motherPhoneNumber);

        return studentDao.updateStudentProfile(
                studentId,
                email,
                dateOfBirth,
                fatherName,
                fatherPhoneNumber,
                motherName,
                motherPhoneNumber);
    }

    /**
     * Changes the student's password.
     *
     * Before changing the password, the current password is checked
     * against the BCrypt hash stored in the database.
     *
     * The new password is then BCrypt-hashed and sent to the DAO.
     *
     * @param studentId authority-assigned student ID
     * @param currentPassword current password
     * @param newPassword new password
     * @return true when the password was successfully changed
     */
    @Override
    @Transactional
    public boolean changePassword(
            String studentId,
            String currentPassword,
            String newPassword) {

        if (isBlank(studentId)) {
            throw new IllegalArgumentException(
                    "Student ID cannot be empty");
        }

        if (isBlank(currentPassword)) {
            throw new IllegalArgumentException(
                    "Current password cannot be empty");
        }

        if (isBlank(newPassword)) {
            throw new IllegalArgumentException(
                    "New password cannot be empty");
        }

        /*
         * Prevent a password from being changed to the same value.
         */
        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException(
                    "New password must be different from current password");
        }

        /*
         * Retrieve the student so that the stored BCrypt hash
         * can be used to verify the current password.
         */
        Student searchStudent = new Student();
        searchStudent.setStudentId(studentId);
        Student student =
                studentDao.findByStudentId(searchStudent);

        if (student == null) {
            throw new IllegalArgumentException(
                    "Student not found with ID: "
                            + studentId);
        }

        /*
         * Ensure that a stored password hash exists.
         */
        if (isBlank(student.getPasswordHash())) {
            throw new IllegalStateException(
                    "Student password is not configured");
        }

        /*
         * Verify the supplied current password against the
         * BCrypt hash stored in the database.
         */
        if (!passwordEncoder.matches(
                currentPassword,
                student.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect");
        }

        /*
         * BCrypt-hash the new password.
         */
        String newPasswordHash =
                passwordEncoder.encode(newPassword);

        /*
         * After changing the initial password, the student no
         * longer needs to be forced to change it.
         */
        return studentDao.updatePassword(
                studentId,
                newPasswordHash,
                false);
    }

    /**
     * Determines whether a string is null, empty, or contains
     * only whitespace.
     *
     * @param value value to check
     * @return true when the value is blank
     */
    private boolean isBlank(String value) {

        return value == null || value.trim().isEmpty();
    }

    /**
     * Converts a null string into an empty string.
     *
     * This is used for student-editable fields that must initially
     * contain empty values rather than null.
     *
     * @param value value to convert
     * @return original value or empty string when null
     */
    private String emptyIfNull(String value) {

        return value == null ? "" : value;
    }
    
    /*implement the de-active student method*/
    @Override
    @Transactional
    public boolean deactivateStudent(String studentId) {

        if (isBlank(studentId)) {
            throw new IllegalArgumentException(
                    "Student ID is required");
        }

        Student student = findByStudentId(studentId);

        if (student == null || !student.isActive()) {
            return false;
        }

        return studentDao.updateStudentStatus(
                studentId,
                false);
    }
    
    /*check status of student*/
    @Override
    @Transactional(readOnly = true)
    public boolean isStudentActive(String studentId) {

        Student student = findByStudentId(studentId);

        return student != null && student.isActive();
    }
    
    @Override
    @Transactional
    public int assignUniversityIdentifiers(
            List<UniversityIdentifierExcelRow> rows) {

        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException(
                    "Excel contains no student records");
        }

        java.util.Set<String> studentIds =
                new java.util.HashSet<>();

        java.util.Set<String> rollNumbers =
                new java.util.HashSet<>();

        java.util.Set<String> registrationNumbers =
                new java.util.HashSet<>();

        // Validate the complete Excel before updating records.
        for (UniversityIdentifierExcelRow row : rows) {

            if (row.getStudentId() == null
                    || row.getStudentId().isBlank()
                    || row.getRoll() == null
                    || row.getRoll().isBlank()
                    || row.getReg() == null
                    || row.getReg().isBlank()
                    || row.getBatch() == null
                    || row.getBatch().isBlank()) {

                throw new IllegalArgumentException(
                        "StudentId, Roll, Reg and Batch are required");
            }

            if (!studentIds.add(row.getStudentId().trim())) {
                throw new IllegalArgumentException(
                        "Duplicate StudentId in Excel: "
                                + row.getStudentId());
            }

            if (!rollNumbers.add(row.getRoll().trim())) {
                throw new IllegalArgumentException(
                        "Duplicate university Roll in Excel: "
                                + row.getRoll());
            }

            if (!registrationNumbers.add(row.getReg().trim())) {
                throw new IllegalArgumentException(
                        "Duplicate university Registration Number in Excel: "
                                + row.getReg());
            }
        }

        // Check and update every student for University roll and reg. no
        for (UniversityIdentifierExcelRow row : rows) {

            Student student = findByStudentId(
                    row.getStudentId().trim());

            if (student == null) {
                throw new IllegalArgumentException(
                        "Student not found: " + row.getStudentId());
            }

            if (!student.getSessionId().equalsIgnoreCase(
                    row.getBatch().trim())) {

                throw new IllegalArgumentException(
                        "Batch mismatch for StudentId: "
                                + row.getStudentId());
            }

            if (!student.getName().trim().equalsIgnoreCase(
                    row.getName().trim())) {

                throw new IllegalArgumentException(
                        "Name mismatch for StudentId: "
                                + row.getStudentId());
            }

            Student updateStudent = new Student();

            updateStudent.setStudentId(student.getStudentId());
            updateStudent.setSessionId(row.getBatch().trim());
            updateStudent.setUniversityRollNo(row.getRoll().trim());
            updateStudent.setUniversityRegistrationNo(row.getReg().trim());

            boolean updated =
                    studentDao.updateUniversityIdentifiers(updateStudent);

            if (!updated) {
                throw new IllegalArgumentException(
                        "Failed to update university identifiers for: "
                                + row.getStudentId());
            }
        }

        return rows.size();
    }

	@Override
	@Transactional
	public int promoteBatch(
	        String sessionId,
	        String courseId,
	        String currentSemesterId) {
	
	    // Validate the batch identifiers.
	    if (sessionId == null || sessionId.trim().isEmpty()) {
	        throw new IllegalArgumentException("Session ID is required.");
	    }
	
	    if (courseId == null || courseId.trim().isEmpty()) {
	        throw new IllegalArgumentException("Course ID is required.");
	    }
	
	    if (currentSemesterId == null ||
	            currentSemesterId.trim().isEmpty()) {
	        throw new IllegalArgumentException("Current semester is required.");
	    }
	
	    sessionId = sessionId.trim();
	    courseId = courseId.trim();
	    currentSemesterId = currentSemesterId.trim();
	
	    // Semester values in the Student table are numeric strings:
	    // "1", "2", "3", etc.
	    final int currentSemester;
	
	    try {
	        currentSemester = Integer.parseInt(currentSemesterId);
	    } catch (NumberFormatException ex) {
	        throw new IllegalArgumentException(
	                "Semester must be a valid number, such as 1 or 2."
	        );
	    }
	
	    // MCA has only four semesters.
	    // Semester 4 must never be promoted to Semester 5.
	    if (currentSemester < 1 || currentSemester >= 4) {
	        throw new IllegalArgumentException(
	                "Promotion rejected. MCA students can only be promoted "
	                + "from Semester 1 to 2, Semester 2 to 3, "
	                + "and Semester 3 to 4. Semester 4 is the final semester."
	        );
	    }
	
	    // Safely calculate the next semester.
	    final String nextSemesterId;
	
	    try {
	        nextSemesterId = String.valueOf(
	                Math.addExact(currentSemester, 1)
	        );
	    } catch (ArithmeticException ex) {
	        throw new IllegalArgumentException(
	                "Semester value is too large."
	        );
	    }
	
	    // Delegate the actual database update to the DAO.
	    // The transaction ensures the batch update is atomic.
	    return studentDao.promoteBatch(
	            sessionId,
	            courseId,
	            currentSemesterId,
	            nextSemesterId
	    );
	}
	

	@Override
	@Transactional
	public int deactivateBatch(
	        String sessionId,
	        String courseId,
	        String semesterId) {
	
	    // Validate required fields.
	    if (sessionId == null || sessionId.trim().isEmpty()) {
	        throw new IllegalArgumentException(
	            "Session ID is required."
	        );
	    }
	
	    if (courseId == null || courseId.trim().isEmpty()) {
	        throw new IllegalArgumentException(
	            "Course ID is required."
	        );
	    }
	
	    if (semesterId == null || semesterId.trim().isEmpty()) {
	        throw new IllegalArgumentException(
	            "Semester ID is required."
	        );
	    }
	
	    String normalizedSessionId = sessionId.trim();
	    String normalizedCourseId = courseId.trim().toUpperCase();
	    String normalizedSemesterId = semesterId.trim();
	
	    // Validate numeric semester.
	    int semester;
	
	    try {
	        semester = Integer.parseInt(normalizedSemesterId);
	    } catch (NumberFormatException ex) {
	        throw new IllegalArgumentException(
	            "Semester ID must be numeric."
	        );
	    }
	
	    // Current MCA course has four semesters.
	    // Only its final semester can be batch-deactivated
	    // through this completed-batch operation.
	    if ("MCA".equals(normalizedCourseId) && semester != 4) {
	        throw new IllegalArgumentException(
	            "Only the completed MCA Semester 4 batch can be deactivated."
	        );
	    }
	
	    if (semester < 1) {
	        throw new IllegalArgumentException(
	            "Invalid semester ID."
	        );
	    }
	
	    return studentDao.deactivateBatch(
	        normalizedSessionId,
	        normalizedCourseId,
	        normalizedSemesterId
	    );
	}


}