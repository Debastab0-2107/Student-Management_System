package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.CAMarks;

/**
 * Data access contract for Continuous Assessment marks.
 */
public interface CAMarksDao {

    /**
     * Inserts new records or updates existing records.
     *
     * The unique business key is:
     * studentId + subjectId + semester.
     *
     * @param records CA records to save
     */
    void saveOrUpdateAll(List<CAMarks> records);

    /**
     * Retrieves all CA records.
     */
    List<CAMarks> findAll();

    /**
     * Retrieves one CA record by its primary key.
     */
    CAMarks findById(String marksId);

    /**
     * Retrieves CA records belonging to a student.
     */
    List<CAMarks> findByStudentId(String studentId);

    /**
     * Retrieves CA records belonging to a semester.
     */
    List<CAMarks> findBySemesterId(String semesterId);
}