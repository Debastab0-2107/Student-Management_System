package com.example.demo.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Student;

/**
 * AdminService
 *
 * Defines business operations available to the department administrator.
 *
 * The main responsibility currently being added is importing students
 * from the authority-provided Excel sheet.
 *
 * Flow:
 *
 * AdminController
 *       ↓
 * AdminService
 *       ↓
 * StudentExcelParser
 *       ↓
 * StudentService
 *       ↓
 * StudentDao
 *       ↓
 * MySQL
 */
public interface AdminService {

    /**
     * Imports student records from an authority Excel file.
     *
     * The Excel file contains only authority-controlled information:
     *
     * - studentId
     * - name
     * - phoneNumber
     * - courseId
     * - sessionId
     *
     * The initial password is NOT taken from Excel.
     *
     * The StudentService is responsible for assigning the agreed
     * initial password and storing its BCrypt hash.
     *
     * @param file authority-provided Excel file
     * @return list of students successfully imported
     */
    List<Student> importStudentsFromExcel(MultipartFile file);
}