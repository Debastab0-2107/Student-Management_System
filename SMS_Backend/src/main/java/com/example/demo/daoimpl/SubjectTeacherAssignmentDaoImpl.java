package com.example.demo.daoimpl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.SubjectTeacherAssignmentDao;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.dto.response.SubjectTeacherAssignmentResponse;
@Repository
public class SubjectTeacherAssignmentDaoImpl implements SubjectTeacherAssignmentDao {
    private final SessionFactory sessionFactory;

    public SubjectTeacherAssignmentDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public boolean isActiveTeacher(String teacherId) {
        try (Session session = sessionFactory.openSession()) {
            Number count = (Number) session.createNativeQuery(
                    "SELECT COUNT(*) FROM faculty WHERE teacher_id = :id AND status = 1")
                    .setParameter("id", teacherId).uniqueResult();
            return count != null && count.longValue() > 0;
        }
    }

    @Override
    public boolean isActiveSubject(String subjectId) {
        try (Session session = sessionFactory.openSession()) {
            Number count = (Number) session.createNativeQuery(
                    "SELECT COUNT(*) FROM subject WHERE subject_id = :id AND is_active = 1")
                    .setParameter("id", subjectId).uniqueResult();
            return count != null && count.longValue() > 0;
        }
    }

    @Override
    public boolean assignmentExists(String teacherId, String subjectId, String sessionId) {
        try (Session session = sessionFactory.openSession()) {
            Number count = (Number) session.createNativeQuery(
                    "SELECT COUNT(*) FROM subject_teacher_assignment "
                    + "WHERE teacher_id = :teacher AND subject_id = :subject AND session_id = :session")
                    .setParameter("teacher", teacherId)
                    .setParameter("subject", subjectId)
                    .setParameter("session", sessionId).uniqueResult();
            return count != null && count.longValue() > 0;
        }
    }

    @Override
    public void activate(String teacherId, String subjectId, String sessionId) {
        executeChange(teacherId, subjectId, sessionId, true);
    }

    @Override
    public void deactivate(String teacherId, String subjectId, String sessionId) {
        executeChange(teacherId, subjectId, sessionId, false);
    }

    private void executeChange(String teacherId, String subjectId,
                               String sessionId, boolean active) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            try {
                if (active) {
                    session.createNativeQuery(
                            "INSERT INTO subject_teacher_assignment "
                            + "(teacher_id, subject_id, session_id, is_active) "
                            + "VALUES (:teacher, :subject, :session, 1) "
                            + "ON DUPLICATE KEY UPDATE is_active = 1, updated_at = CURRENT_TIMESTAMP")
                            .setParameter("teacher", teacherId)
                            .setParameter("subject", subjectId)
                            .setParameter("session", sessionId).executeUpdate();
                } else {
                    session.createNativeQuery(
                            "UPDATE subject_teacher_assignment SET is_active = 0 "
                            + "WHERE teacher_id = :teacher AND subject_id = :subject "
                            + "AND session_id = :session")
                            .setParameter("teacher", teacherId)
                            .setParameter("subject", subjectId)
                            .setParameter("session", sessionId).executeUpdate();
                }
                tx.commit();
            } catch (RuntimeException ex) {
                if (tx.isActive()) tx.rollback();
                throw ex;
            }
        }
    }
    
    @Override
    public boolean isTeacherAssignedForStudentSubjectSemester(
            String teacherId,
            String studentId,
            String subjectId,
            String semesterId) {

        try (Session session = sessionFactory.openSession()) {

            Number count = (Number) session.createNativeQuery(
                    "SELECT COUNT(*) " +
                    "FROM student st " +
                    "JOIN subject s ON s.subject_id = :subjectId " +
                    "JOIN subject_teacher_assignment a " +
                    "ON a.teacher_id = :teacherId " +
                    "AND a.subject_id = s.subject_id " +
                    "AND a.session_id = st.session_id " +
                    "AND a.is_active = 1 " +
                    "JOIN faculty f ON f.teacher_id = a.teacher_id " +
                    "AND f.status = 1 " +
                    "WHERE st.student_id = :studentId " +
                    "AND st.is_active = 1 " +
                    "AND s.is_active = 1 " +
                    "AND st.course_id = s.course_id " +
                    "AND s.semester_id = :semesterId " +
                    "AND CAST(st.current_semester_id AS UNSIGNED) = " +
                    "CAST(REPLACE(:semesterId, 'SEM', '') AS UNSIGNED)"
            )
            .setParameter("teacherId", teacherId)
            .setParameter("studentId", studentId)
            .setParameter("subjectId", subjectId)
            .setParameter("semesterId", semesterId)
            .uniqueResult();

            return count != null && count.longValue() > 0;
        }
    }
    
    @Override
    public boolean isActiveStudentInSemester(
            String studentId,
            String semesterId) {

        try (Session session = sessionFactory.openSession()) {

            Number count = (Number) session.createNativeQuery(
                    "SELECT COUNT(*) FROM student " +
                    "WHERE student_id = :studentId " +
                    "AND is_active = 1 " +
                    "AND CAST(current_semester_id AS UNSIGNED) = " +
                    "CAST(REPLACE(:semesterId, 'SEM', '') AS UNSIGNED)"
            )
            .setParameter("studentId", studentId)
            .setParameter("semesterId", semesterId)
            .uniqueResult();

            return count != null && count.longValue() > 0;
        }
    }

    @Override
    public boolean isActiveSubjectInSemester(
            String subjectId,
            String semesterId) {

        try (Session session = sessionFactory.openSession()) {

            Number count = (Number) session.createNativeQuery(
                    "SELECT COUNT(*) FROM subject " +
                    "WHERE subject_id = :subjectId " +
                    "AND semester_id = :semesterId " +
                    "AND is_active = 1"
            )
            .setParameter("subjectId", subjectId)
            .setParameter("semesterId", semesterId)
            .uniqueResult();

            return count != null && count.longValue() > 0;
        }
    }
    

@Override
public List<SubjectTeacherAssignmentResponse> getActiveAssignments() {

    try (Session session = sessionFactory.openSession()) {

        List<Object[]> rows = session.createNativeQuery(
                "SELECT " +
                "a.teacher_id, " +
                "f.name, " +
                "f.status, " +
                "a.subject_id, " +
                "s.subject_name, " +
                "a.session_id " +
                "FROM subject_teacher_assignment a " +
                "JOIN faculty f ON f.teacher_id = a.teacher_id " +
                "JOIN subject s ON s.subject_id = a.subject_id " +
                "WHERE a.is_active = 1 " +
                "ORDER BY s.subject_name, a.session_id, f.name"
        ).getResultList();

        List<SubjectTeacherAssignmentResponse> assignments =
                new ArrayList<>();

        for (Object[] row : rows) {

            boolean teacherActive = Boolean.TRUE.equals(row[2]);

            SubjectTeacherAssignmentResponse assignment =
                    new SubjectTeacherAssignmentResponse(
                            (String) row[0],
                            (String) row[1],
                            teacherActive,
                            (String) row[3],
                            (String) row[4],
                            (String) row[5]
                    );

            // THIS LINE WAS MISSING
            assignments.add(assignment);
        }

        return assignments;
    }
}

}