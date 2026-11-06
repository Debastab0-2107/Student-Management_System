package com.example.demo.service;

import java.util.List;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.model.Subject;
import java.util.Map;

/**
 * Defines the business operations available for Subject management.
 *
 * This interface separates the Subject business layer from the
 * controller and data-access layers.
 */
public interface SubjectService {

    /**
     * Creates and saves a new subject.
     *
     * @param subject subject details to save
     * @return the saved subject
     */
    Subject createSubject(Subject subject);

    /**
     * Retrieves a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return the matching subject, or null if not found
     */
    Subject getSubjectById(String subjectId);

    /**
     * Retrieves all subjects.
     *
     * @return list of all subjects
     */
    List<Subject> getAllSubjects();

    /**
     * Updates an existing subject.
     *
     * @param subject subject containing updated details
     * @return true if the subject was successfully updated
     */
    boolean updateSubject(Subject subject);

    /**
     * Deletes a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return true if the subject was successfully deleted
     */
    boolean deleteSubject(String subjectId);

    int importSubjectsFromExcel(MultipartFile file)
            throws IOException;
    
    int updateSubjectsFromExcel(MultipartFile file)
            throws IOException;

    int deactivateSubjectsFromExcel(MultipartFile file)
            throws IOException;

    List<Subject> getActiveSubjectsByCourse(String courseId);

    List<Subject> getActiveSubjectsBySemester(
            String courseId, String semesterId);

    Map<String, List<Subject>> getSubjectsSemesterWise(String courseId);
}