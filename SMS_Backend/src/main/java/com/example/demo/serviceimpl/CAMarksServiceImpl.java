package com.example.demo.serviceimpl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.CAMarksDao;
import com.example.demo.model.CAMarks;
import com.example.demo.service.CAMarksService;

/**
 * Business logic implementation for Continuous Assessment marks.
 *
 * Enforces the single-CA rules before records are passed to the DAO.
 *
 * One CA record is maintained for each:
 * studentId + subjectId + semester.
 */
@Service
@Transactional
public class CAMarksServiceImpl implements CAMarksService {

    private static final BigDecimal MAX_CA_MARKS =
            BigDecimal.valueOf(25);

    private final CAMarksDao caMarksDao;

    public CAMarksServiceImpl(CAMarksDao caMarksDao) {
        this.caMarksDao = caMarksDao;
    }

    /**
     * Saves one CA record.
     *
     * The DAO uses the student, subject and semester combination
     * to determine whether to insert or update.
     */
    @Override
    public void saveCAMarks(CAMarks caMarks) {

        validateCAMarks(caMarks);

        caMarksDao.saveOrUpdateAll(List.of(caMarks));
    }

    /**
     * Saves or updates multiple CA records.
     *
     * Every record is validated before the DAO starts its transaction.
     */
    @Override
    public void saveAllCAMarks(List<CAMarks> records) {

        if (records == null || records.isEmpty()) {
            throw new IllegalArgumentException(
                    "No CA marks were provided.");
        }

        /*
         * Validate the complete list before database operations.
         */
        for (CAMarks record : records) {
            validateCAMarks(record);
        }

        /*
         * The DAO handles the complete batch in one transaction.
         */
        caMarksDao.saveOrUpdateAll(records);
    }

    /**
     * Validates a CA record.
     *
     * CA marks must be between 0 and 25.
     * No CA1/CA2 number is accepted or required.
     */
    private void validateCAMarks(CAMarks caMarks) {

        if (caMarks == null) {
            throw new IllegalArgumentException(
                    "CA marks record cannot be null.");
        }

        if (isBlank(caMarks.getMarksId())) {
            throw new IllegalArgumentException(
                    "Marks ID is required.");
        }

        if (isBlank(caMarks.getStudentId())) {
            throw new IllegalArgumentException(
                    "Student ID is required.");
        }

        if (isBlank(caMarks.getTeacherId())) {
            throw new IllegalArgumentException(
                    "Teacher ID is required.");
        }

        if (isBlank(caMarks.getSubjectId())) {
            throw new IllegalArgumentException(
                    "Subject ID is required.");
        }

        if (isBlank(caMarks.getSem())) {
            throw new IllegalArgumentException(
                    "Semester is required.");
        }

        BigDecimal marks = caMarks.getTotalMarks();

        if (marks == null
                || marks.compareTo(BigDecimal.ZERO) < 0
                || marks.compareTo(MAX_CA_MARKS) > 0) {

            throw new IllegalArgumentException(
                    "CA marks must be between 0 and 25.");
        }
    }

    /**
     * Checks whether a string is null or blank.
     */
    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    /**
     * Retrieves all CA records.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CAMarks> getAllCAMarks() {

        return caMarksDao.findAll();
    }

    /**
     * Retrieves one CA record by its primary key.
     */
    @Override
    @Transactional(readOnly = true)
    public CAMarks getCAMarksById(String marksId) {

        if (isBlank(marksId)) {
            throw new IllegalArgumentException(
                    "Marks ID is required.");
        }

        return caMarksDao.findById(marksId);
    }

    /**
     * Retrieves CA records belonging to one student.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CAMarks> getCAMarksByStudentId(String studentId) {

        if (isBlank(studentId)) {
            throw new IllegalArgumentException(
                    "Student ID is required.");
        }

        return caMarksDao.findByStudentId(studentId);
    }

    /**
     * Retrieves CA records belonging to one semester.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CAMarks> getCAMarksBySemesterId(String semesterId) {

        if (isBlank(semesterId)) {
            throw new IllegalArgumentException(
                    "Semester ID is required.");
        }

        return caMarksDao.findBySemesterId(semesterId);
    }
}