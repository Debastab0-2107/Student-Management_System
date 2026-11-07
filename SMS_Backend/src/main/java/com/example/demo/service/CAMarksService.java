package com.example.demo.service;

import java.util.List;

import com.example.demo.model.CAMarks;

/**
 * Business service contract for Continuous Assessment marks.
 */
public interface CAMarksService {

    /**
     * Saves one CA record.
     */
    void saveCAMarks(CAMarks caMarks);

    /**
     * Saves or updates a batch of CA records.
     */
    void saveAllCAMarks(List<CAMarks> records);

    /**
     * Retrieves all CA records.
     */
    List<CAMarks> getAllCAMarks();

    /**
     * Retrieves a CA record by its primary key.
     */
    CAMarks getCAMarksById(String marksId);

    /**
     * Retrieves CA records belonging to one student.
     */
    List<CAMarks> getCAMarksByStudentId(String studentId);

    /**
     * Retrieves CA records belonging to one semester.
     */
    List<CAMarks> getCAMarksBySemesterId(String semesterId);
}