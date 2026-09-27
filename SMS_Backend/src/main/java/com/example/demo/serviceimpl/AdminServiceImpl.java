package com.example.demo.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.StudentExcelRow;
import com.example.demo.model.Student;
import com.example.demo.service.AdminService;
import com.example.demo.service.StudentService;
import com.example.demo.util.StudentExcelParser;

/**
 * AdminServiceImpl
 *
 * Implements administrator-level business operations.
 *
 * Current responsibility:
 * - Read students from the authority Excel file.
 * - Convert each Excel row into a Student object.
 * - Send each Student to StudentService for validation,
 *   password initialization, and database creation.
 *
 * Important:
 * - This class does NOT directly access Hibernate or the database.
 * - This class does NOT store a plaintext password.
 * - The initial password is handled by StudentService.
 *
 * Flow:
 *
 * AdminController
 *       ↓
 * AdminServiceImpl
 *       ↓
 * StudentExcelParser
 *       ↓
 * StudentExcelRow
 *       ↓
 * StudentService
 *       ↓
 * StudentDao
 *       ↓
 * MySQL
 */
@Service
public class AdminServiceImpl implements AdminService {

    /*
     * Parser responsible only for reading the Excel file.
     */
    private final StudentExcelParser studentExcelParser;

    /*
     * StudentService responsible for student business rules
     * and database creation through the proper service layer.
     */
    private final StudentService studentService;

    /**
     * Constructor-based dependency injection.
     *
     * @param studentExcelParser Excel parser
     * @param studentService student business service
     */
    public AdminServiceImpl(
            StudentExcelParser studentExcelParser,
            StudentService studentService) {

        this.studentExcelParser = studentExcelParser;
        this.studentService = studentService;
    }

    /**
     * Imports students from the authority Excel file.
     *
     * Each Excel row is converted into a Student object.
     *
     * The following fields are initially empty because they are
     * student-editable fields:
     *
     * - email
     * - dateOfBirth
     * - fatherName
     * - fatherPhoneNumber
     * - motherName
     * - motherPhoneNumber
     *
     * StudentService then:
     *
     * - validates authority-controlled fields
     * - checks duplicate student ID
     * - assigns the initial password
     * - BCrypt-hashes the password
     * - sets mustChangePassword = true
     * - saves the student
     *
     * @param file authority-provided Excel file
     * @return successfully imported students
     */
    @Override
    public List<Student> importStudentsFromExcel(
            MultipartFile file) {

        try {

            /*
             * Read and convert the Excel rows.
             */
            List<StudentExcelRow> excelRows =
                    studentExcelParser.parse(file);

            /*
             * Store successfully created students.
             */
            List<Student> importedStudents =
                    new ArrayList<>();

            /*
             * Process every Excel row.
             */
            for (StudentExcelRow row : excelRows) {

                /*
                 * Convert the Excel DTO into the Student model.
                 *
                 * Student-editable fields are deliberately
                 * initialized as empty strings.
                 */
                Student student = new Student();

                student.setStudentId(
                        row.getStudentId());

                student.setName(
                        row.getName());

                student.setPhoneNumber(
                        row.getPhoneNumber());

                student.setCourseId(
                        row.getCourseId());

                student.setSessionId(
                        row.getSessionId());

                student.setEmail("");
                student.setDateOfBirth("");

                student.setFatherName("");
                student.setFatherPhoneNumber("");

                student.setMotherName("");
                student.setMotherPhoneNumber("");

                /*
                 * Do NOT set passwordHash here.
                 *
                 * StudentService is responsible for creating
                 * the initial password hash.
                 */
                Student savedStudent =
                        studentService.createStudent(student);

                importedStudents.add(savedStudent);
            }

            return importedStudents;

        } catch (IllegalArgumentException e) {

            /*
             * Validation errors such as:
             * - missing required Excel data
             * - duplicate student ID
             * - invalid Excel headers
             *
             * are propagated with their original message.
             */
            throw e;

        } catch (Exception e) {

            /*
             * Convert unexpected Excel/import errors into a
             * meaningful service-level exception.
             */
            throw new IllegalArgumentException(
                    "Failed to import students from Excel: "
                            + e.getMessage(),
                    e);
        }
    }
}