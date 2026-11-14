package com.example.demo.serviceimpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.demo.dao.SubjectTeacherAssignmentDao;
import com.example.demo.service.SubjectTeacherAssignmentExcelRow;
import com.example.demo.service.SubjectTeacherAssignmentService;

@Service
public class SubjectTeacherAssignmentServiceImpl implements SubjectTeacherAssignmentService {
    private final SubjectTeacherAssignmentDao assignmentDao;

    public SubjectTeacherAssignmentServiceImpl(SubjectTeacherAssignmentDao assignmentDao) {
        this.assignmentDao = assignmentDao;
    }

    @Override
    public int processUpload(List<SubjectTeacherAssignmentExcelRow> rows) {
        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException("No assignment rows supplied.");
        }

        // Validate the entire workbook before changing any database rows.
        Set<String> seen = new HashSet<>();
        for (int i = 0; i < rows.size(); i++) {
            SubjectTeacherAssignmentExcelRow row = rows.get(i);
            if (row == null || blank(row.getTeacherId()) || blank(row.getSubjectId())
                    || blank(row.getSessionId()) || blank(row.getAction())) {
                throw new IllegalArgumentException("Incomplete assignment at workbook data row " + (i + 1) + ".");
            }
            String action = row.getAction().trim().toUpperCase();
            if (!action.equals("ASSIGN") && !action.equals("DEACTIVATE")) {
                throw new IllegalArgumentException("Unsupported action at workbook data row " + (i + 1) + ".");
            }
            String key = row.getTeacherId().trim() + "|" + row.getSubjectId().trim()
                    + "|" + row.getSessionId().trim();
            if (!seen.add(key)) {
                throw new IllegalArgumentException("Duplicate teacher/subject/session combination in Excel: " + key);
            }
            if (action.equals("ASSIGN")) {
                if (!assignmentDao.isActiveTeacher(row.getTeacherId().trim())) {
                    throw new IllegalArgumentException("Teacher is missing or inactive: " + row.getTeacherId());
                }
                if (!assignmentDao.isActiveSubject(row.getSubjectId().trim())) {
                    throw new IllegalArgumentException("Subject is missing or inactive: " + row.getSubjectId());
                }
            } else if (!assignmentDao.assignmentExists(row.getTeacherId().trim(),
                    row.getSubjectId().trim(), row.getSessionId().trim())) {
                throw new IllegalArgumentException("Cannot deactivate an assignment that does not exist: " + key);
            }
        }

        // Apply only after all rows pass validation.
        for (SubjectTeacherAssignmentExcelRow row : rows) {
            String teacher = row.getTeacherId().trim();
            String subject = row.getSubjectId().trim();
            String session = row.getSessionId().trim();
            if (row.getAction().trim().equalsIgnoreCase("ASSIGN")) {
                assignmentDao.activate(teacher, subject, session);
            } else {
                assignmentDao.deactivate(teacher, subject, session);
            }
        }
        return rows.size();
    }

    private boolean blank(String value) {
        return value == null || value.trim().isEmpty();
    }

	@Override
	public void validateTeacherCanUpload(String authenticatedTeacherId, String studentId, String subjectId,
			String semesterId) {
		// TODO Auto-generated method stub
		
	}
}