
package com.example.demo.serviceimpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dao.SubjectDao;
import com.example.demo.dto.request.SubjectExcelRow;
import com.example.demo.exception.FileValidationException;
import com.example.demo.model.Subject;
import com.example.demo.service.SubjectService;
import com.example.demo.util.SubjectExcelParser;

/**
 * Service implementation responsible for Subject management.
 *
 * <p>This class contains the business logic for creating, retrieving,
 * updating, importing, and deactivating subjects.</p>
 *
 * <p>Subject deletion follows a soft-delete approach:
 * active = true  : Subject is active.
 * active = false : Subject is inactive.</p>
 *
 * <p>Academic history is preserved when a subject is deactivated.</p>
 */
@Service
public class SubjectServiceImpl implements SubjectService {

    /** Data access component for Subject database operations. */
    private final SubjectDao subjectDao;

    /** Utility responsible for parsing Subject Excel files. */
    private final SubjectExcelParser subjectExcelParser;

    /**
     * Constructs the Subject service with its required dependencies.
     *
     * @param subjectDao DAO responsible for Subject persistence
     * @param subjectExcelParser parser responsible for Excel processing
     */
    public SubjectServiceImpl(
            SubjectDao subjectDao,
            SubjectExcelParser subjectExcelParser) {

        this.subjectDao = subjectDao;
        this.subjectExcelParser = subjectExcelParser;
    }

    /**
     * Creates a new subject.
     *
     * @param subject subject information to be saved
     * @return the persisted subject
     * @throws IllegalArgumentException if the subject ID already exists
     */
    @Override
    public Subject createSubject(Subject subject) {

        validateSubject(subject);
        subject.setActive(true);
        if (subjectDao.findById(subject.getSubjectId()) != null) {
            throw new IllegalArgumentException(
                    "Subject already exists: " + subject.getSubjectId());
        }

        // Every newly created subject must initially be active.
        subject.setActive(true);

        return subjectDao.save(subject);
    }

    /**
     * Retrieves a subject using its unique identifier.
     *
     * <p>This method can retrieve both active and inactive subjects.</p>
     *
     * @param subjectId unique subject identifier
     * @return matching subject, or null if not found
     */
    @Override
    public Subject getSubjectById(String subjectId) {

        validateSubjectId(subjectId);

        return subjectDao.findById(subjectId);
    }

    /**
     * Retrieves all subjects, including inactive subjects.
     *
     * <p>This method is useful for administrative monitoring.</p>
     *
     * @return list of all subjects
     */
    @Override
    public List<Subject> getAllSubjects() {

        return subjectDao.findAll();
    }

    /**
     * Updates an existing active subject.
     *
     * @param subject subject containing updated information
     * @return true if the update succeeds; otherwise false
     */
    @Override
    public boolean updateSubject(Subject subject) {

        validateSubject(subject);

        return subjectDao.update(subject);
    }

    /**
     * Deactivates a subject instead of physically deleting it.
     *
     * <p>The subject remains stored in the database, preserving
     * references from academic marks and historical records.</p>
     *
     * @param subjectId unique subject identifier
     * @return true if the subject was deactivated
     */
    @Override
    public boolean deleteSubject(String subjectId) {

        validateSubjectId(subjectId);

        return subjectDao.deleteById(subjectId);
    }

    /**
     * Imports new subjects from an Excel spreadsheet.
     *
     * <p>Existing subject IDs and duplicate IDs within the uploaded
     * spreadsheet are rejected.</p>
     *
     * @param file Excel spreadsheet containing subject information
     * @return number of subjects imported
     * @throws IOException if the spreadsheet cannot be read
     */
    @Override
    public int importSubjectsFromExcel(MultipartFile file)
            throws IOException {

        List<SubjectExcelRow> rows = subjectExcelParser.parse(file);

        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException(
                    "No subject records found in Excel.");
        }

        List<Subject> subjects = new ArrayList<>();
        Set<String> subjectIds = new HashSet<>();

        for (int i = 0; i < rows.size(); i++) {

            SubjectExcelRow row = rows.get(i);

            validateExcelRow(row, i + 2);

            String subjectId = row.getSubjectId().trim();

            if (!subjectIds.add(subjectId)) {
                throw new IllegalArgumentException(
                        "Duplicate subject ID in Excel at row "
                        + (i + 2) + ": " + subjectId);
            }

            if (subjectDao.findById(subjectId) != null) {
                throw new IllegalArgumentException(
                        "Subject already exists in database: "
                        + subjectId);
            }

            Subject subject = new Subject();

            subject.setSubjectId(subjectId);
            subject.setSubjectName(row.getSubjectName().trim());
            subject.setCourseId(row.getCourseId().trim());
            subject.setSemesterId(row.getSemesterId().trim());
            subject.setActive(true);

            subjects.add(subject);
        }

        subjectDao.saveAll(subjects);

        return subjects.size();
    }

    /**
     * Updates existing active subjects using an Excel spreadsheet.
     *
     * <p>Unlike subject insertion, this operation never creates
     * new subjects. Every supplied subject ID must already exist
     * and must be active.</p>
     *
     * @param file Excel spreadsheet containing updated subject details
     * @return number of subjects updated
     * @throws IOException if the spreadsheet cannot be read
     */
    @Override
    public int updateSubjectsFromExcel(MultipartFile file)
            throws IOException {

        List<SubjectExcelRow> rows = subjectExcelParser.parse(file);

        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException(
                    "No subject records found in Excel.");
        }

        List<Subject> subjects = new ArrayList<>();
        Set<String> subjectIds = new HashSet<>();

        for (int i = 0; i < rows.size(); i++) {

            SubjectExcelRow row = rows.get(i);

            validateExcelRow(row, i + 2);

            String subjectId = row.getSubjectId().trim();

            if (!subjectIds.add(subjectId)) {
                throw new IllegalArgumentException(
                        "Duplicate subject ID at Excel row "
                        + (i + 2) + ": " + subjectId);
            }

            Subject existing = subjectDao.findById(subjectId);

            if (existing == null) {
                throw new IllegalArgumentException(
                        "Subject does not exist: " + subjectId);
            }

            if (!existing.isActive()) {
                throw new IllegalArgumentException(
                        "Cannot update inactive subject: " + subjectId);
            }

            Subject subject = new Subject();

            subject.setSubjectId(subjectId);
            subject.setSubjectName(row.getSubjectName().trim());
            subject.setCourseId(row.getCourseId().trim());
            subject.setSemesterId(row.getSemesterId().trim());

            subjects.add(subject);
        }

        boolean updated = subjectDao.updateAll(subjects);

        if (!updated) {
            throw new IllegalArgumentException(
                    "Excel update failed. Verify all subject IDs.");
        }

        return subjects.size();
    }

    /**
     * Deactivates subjects listed in an Excel spreadsheet.
     *
     * <p>The spreadsheet must contain a subjectId column.
     * No database records are physically deleted.</p>
     *
     * @param file Excel spreadsheet containing subject IDs
     * @return number of subjects newly deactivated
     * @throws IOException if the spreadsheet cannot be read
     */
    @Override
    public int deactivateSubjectsFromExcel(MultipartFile file)
            throws IOException {

        List<String> ids = subjectExcelParser.parseSubjectIds(file);

        Set<String> uniqueIds = new HashSet<>();

        for (String id : ids) {

            if (id == null || id.isBlank()) {
                throw new IllegalArgumentException(
                        "Subject ID must not be empty.");
            }

            id = id.trim();

            if (!uniqueIds.add(id)) {
                throw new IllegalArgumentException(
                        "Duplicate subject ID in Excel: " + id);
            }

            if (subjectDao.findById(id) == null) {
                throw new IllegalArgumentException(
                        "Subject does not exist: " + id);
            }
        }

        return subjectDao.deactivateAll(ids);
    }

    /**
     * Retrieves all active subjects belonging to a course.
     *
     * @param courseId course identifier
     * @return active subjects belonging to the specified course
     */
    @Override
    public List<Subject> getActiveSubjectsByCourse(String courseId) {

        validateSubjectId(courseId);

        return subjectDao.findActiveByCourseId(courseId.trim());
    }

    /**
     * Retrieves active subjects for a particular course and semester.
     *
     * @param courseId course identifier
     * @param semesterId semester identifier
     * @return active subjects belonging to the specified semester
     */
    @Override
    public List<Subject> getActiveSubjectsBySemester(
            String courseId, String semesterId) {

        validateSubjectId(courseId);
        validateSubjectId(semesterId);

        return subjectDao.findActiveByCourseAndSemester(
                courseId.trim(), semesterId.trim());
    }

    /**
     * Retrieves active subjects grouped semester-wise for a course.
     *
     * <p>The returned map uses semester IDs as keys and the
     * corresponding subject lists as values.</p>
     *
     * @param courseId course identifier
     * @return semester-wise map of active subjects
     */
    @Override
    public Map<String, List<Subject>> getSubjectsSemesterWise(
            String courseId) {

        validateSubjectId(courseId);

        List<Subject> subjects =
                subjectDao.findActiveByCourseId(courseId.trim());

        Map<String, List<Subject>> result = new TreeMap<>();

        for (Subject subject : subjects) {

            result.computeIfAbsent(
                    subject.getSemesterId(),
                    key -> new ArrayList<>()
            ).add(subject);
        }

        return result;
    }

    /**
     * Validates mandatory subject information.
     *
     * @param subject subject object to validate
     */
    private void validateSubject(Subject subject) {

        if (subject == null) {
            throw new FileValidationException(
                    "Subject data must not be null.");
        }

        validateSubjectId(subject.getSubjectId());

        if (subject.getSubjectName() == null
                || subject.getSubjectName().isBlank()) {

            throw new IllegalArgumentException(
                    "Subject name must not be empty.");
        }

        if (subject.getCourseId() == null
                || subject.getCourseId().isBlank()) {

            throw new IllegalArgumentException(
                    "Course ID must not be empty.");
        }

        if (subject.getSemesterId() == null
                || subject.getSemesterId().isBlank()) {

            throw new IllegalArgumentException(
                    "Semester ID must not be empty.");
        }
    }

    /**
     * Validates a subject identifier.
     *
     * @param subjectId subject identifier to validate
     */
    private void validateSubjectId(String subjectId) {

        if (subjectId == null || subjectId.isBlank()) {
            throw new IllegalArgumentException(
                    "Subject ID must not be empty.");
        }
    }

    /**
     * Validates the mandatory fields of an Excel subject row.
     *
     * @param row Excel row containing subject information
     * @param rowNumber spreadsheet row number for error reporting
     */
    private void validateExcelRow(
            SubjectExcelRow row, int rowNumber) {

        if (row == null
                || row.getSubjectId() == null
                || row.getSubjectId().isBlank()
                || row.getSubjectName() == null
                || row.getSubjectName().isBlank()
                || row.getCourseId() == null
                || row.getCourseId().isBlank()
                || row.getSemesterId() == null
                || row.getSemesterId().isBlank()) {

            throw new IllegalArgumentException(
                    "Missing required subject information at Excel row "
                    + rowNumber);
        }
    }
}
