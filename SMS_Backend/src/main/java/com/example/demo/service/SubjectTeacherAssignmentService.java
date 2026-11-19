package com.example.demo.service;

import java.util.List;
import com.example.demo.dto.response.SubjectTeacherAssignmentResponse;

public interface SubjectTeacherAssignmentService {
    int processUpload(List<SubjectTeacherAssignmentExcelRow> rows);

	void validateTeacherCanUpload(String authenticatedTeacherId, String studentId, String subjectId, String semesterId);

	List<SubjectTeacherAssignmentResponse> getActiveAssignments();
}