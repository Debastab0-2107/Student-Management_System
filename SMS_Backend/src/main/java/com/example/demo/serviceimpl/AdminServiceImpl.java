package com.example.demo.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.FacultyDeactivateExcelRow;
import com.example.demo.dto.request.FacultyExcelRow;
import com.example.demo.dto.request.StudentExcelRow;
import com.example.demo.model.Faculty;
import com.example.demo.model.Student;
import com.example.demo.service.AdminService;
import com.example.demo.service.FacultyService;
import com.example.demo.service.StudentService;
import com.example.demo.util.FacultyExcelParser;
import com.example.demo.util.StudentExcelParser;

/**
 * AdminServiceImpl
 *
 * Implements administrator-level business operations.
 *
 * Responsibilities:
 *
 * Student:
 * - Import students from authority Excel.
 *
 * Regular Faculty:
 * - Import permanent faculty from authority Excel.
 * - Deactivate permanent faculty from authority deactivation Excel.
 *
 * Visiting Faculty:
 * - Visiting faculty are handled directly by FacultyService
 *   through Admin-protected endpoints.
 *
 * Important:
 *
 * This class does not directly communicate with Hibernate.
 * All database operations go through the appropriate service layer.
 */
@Service
public class AdminServiceImpl implements AdminService {

    /*
     * Existing parser for student Excel files.
     */
    private final StudentExcelParser studentExcelParser;

    /*
     * Existing student business service.
     */
    private final StudentService studentService;

    /*
     * Parser for regular faculty Excel files.
     */
    private final FacultyExcelParser facultyExcelParser;

    /*
     * Faculty business service.
     */
    private final FacultyService facultyService;

    /**
     * Constructor-based dependency injection.
     *
     * @param studentExcelParser student Excel parser
     * @param studentService student service
     * @param facultyExcelParser faculty Excel parser
     * @param facultyService faculty service
     */
    public AdminServiceImpl(
            StudentExcelParser studentExcelParser,
            StudentService studentService,
            FacultyExcelParser facultyExcelParser,
            FacultyService facultyService) {

        this.studentExcelParser = studentExcelParser;
        this.studentService = studentService;
        this.facultyExcelParser = facultyExcelParser;
        this.facultyService = facultyService;
    }

    /**
     * Imports students from the authority Excel file.
     *
     * @param file authority-provided student Excel file
     * @return successfully imported students
     */
    @Override
    public List<Student> importStudentsFromExcel(
            MultipartFile file) {

        try {

            /*
             * Parse the Excel file.
             */
            List<StudentExcelRow> excelRows =
                    studentExcelParser.parse(file);

            /*
             * Keep track of successfully created students.
             */
            List<Student> importedStudents =
                    new ArrayList<>();

            /*
             * Process every Excel row.
             */
            for (StudentExcelRow row : excelRows) {

                Student student = new Student();

                /*
                 * Authority-controlled fields.
                 */
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

                /*
                 * Student-editable fields start empty.
                 */
                student.setEmail("");
                student.setDateOfBirth("");

                student.setFatherName("");
                student.setFatherPhoneNumber("");

                student.setMotherName("");
                student.setMotherPhoneNumber("");

                /*
                 * StudentService handles:
                 *
                 * - duplicate validation
                 * - initial password
                 * - BCrypt hashing
                 * - mustChangePassword
                 * - database persistence
                 */
                Student savedStudent =
                        studentService.createStudent(student);

                importedStudents.add(savedStudent);
            }

            return importedStudents;

        } catch (IllegalArgumentException e) {

            /*
             * Preserve validation errors.
             */
            throw e;

        } catch (Exception e) {

            /*
             * Convert unexpected errors into a meaningful
             * import exception.
             */
            throw new IllegalArgumentException(
                    "Failed to import students from Excel: "
                            + e.getMessage(),
                    e);
        }
    }

    /**
     * Imports regular/permanent faculty from the authority Excel.
     *
     * Only faculty whose facultyType is REGULAR are accepted.
     *
     * @param file authority-provided regular faculty Excel
     * @return number of successfully imported faculty
     */
    @Override
    public int importRegularFacultyFromExcel(
            MultipartFile file) {

        try {

            /*
             * Parse and validate the authority Excel.
             */
            List<FacultyExcelRow> rows =
                    facultyExcelParser
                            .parseRegularFacultyExcel(file);

            int importedCount = 0;

            /*
             * Process each regular faculty record.
             */
            for (FacultyExcelRow row : rows) {

                /*
                 * Convert Excel DTO to Faculty model.
                 */
                Faculty faculty = new Faculty();

                faculty.setTeacherId(
                        row.getTeacherId());

                faculty.setName(
                        row.getName());

                faculty.setPhoneNumber(
                        row.getPhoneNumber());

                faculty.setFacultyType(
                        "REGULAR");

                faculty.setDeptId(
                        row.getDeptId());

                /*
                 * Newly imported faculty are active.
                 */
                faculty.setStatus(true);

                /*
                 * FacultyService performs duplicate validation
                 * and persistence.
                 */
                facultyService.save(faculty);

                importedCount++;
            }

            return importedCount;

        } catch (IllegalArgumentException e) {

            /*
             * Preserve validation/business errors.
             */
            throw e;

        } catch (Exception e) {

            /*
             * Convert unexpected errors into an import error.
             */
            throw new IllegalArgumentException(
                    "Failed to import regular faculty from Excel: "
                            + e.getMessage(),
                    e);
        }
    }

    /**
     * Deactivates regular/permanent faculty using the
     * authority-provided deactivation Excel.
     *
     * No physical DELETE operation is performed.
     *
     * @param file authority-provided deactivation Excel
     * @return number of successfully deactivated faculty
     */
    @Override
    public int deactivateRegularFacultyFromExcel(
            MultipartFile file) {

        try {

            /*
             * Parse the authority deactivation Excel.
             */
            List<FacultyDeactivateExcelRow> rows =
                    facultyExcelParser
                            .parseRegularFacultyDeactivationExcel(
                                    file);

            int deactivatedCount = 0;

            /*
             * Process each teacher ID.
             */
            for (FacultyDeactivateExcelRow row : rows) {

                /*
                 * Find the existing faculty record.
                 */
                Faculty faculty =
                        facultyService.findById(
                                row.getTeacherId());

                if (faculty == null) {

                    throw new IllegalArgumentException(
                            "Faculty not found with teacher ID: "
                                    + row.getTeacherId());
                }

                /*
                 * Ensure that the authority deactivation file
                 * is being used for a REGULAR faculty member.
                 */
                if (!"REGULAR".equalsIgnoreCase(
                        faculty.getFacultyType())) {

                    throw new IllegalArgumentException(
                            "Teacher ID "
                                    + row.getTeacherId()
                                    + " is not a regular faculty member");
                }

                /*
                 * Deactivate the faculty.
                 *
                 * This changes status to false instead of
                 * physically deleting the record.
                 */
                boolean deactivated =
                        facultyService.deactivateById(
                                row.getTeacherId());

                if (deactivated) {
                    deactivatedCount++;
                }
            }

            return deactivatedCount;

        } catch (IllegalArgumentException e) {

            /*
             * Preserve validation errors.
             */
            throw e;

        } catch (Exception e) {

            /*
             * Convert unexpected errors into a meaningful
             * deactivation error.
             */
            throw new IllegalArgumentException(
                    "Failed to deactivate regular faculty: "
                            + e.getMessage(),
                    e);
        }
    }
}