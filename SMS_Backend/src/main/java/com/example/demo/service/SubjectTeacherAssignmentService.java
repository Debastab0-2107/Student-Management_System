package com.example.demo.service;

import java.util.List;

public interface SubjectTeacherAssignmentService {
    int processUpload(List<SubjectTeacherAssignmentExcelRow> rows);

	void validateTeacherCanUpload(String authenticatedTeacherId, String studentId, String subjectId, String semesterId);
}