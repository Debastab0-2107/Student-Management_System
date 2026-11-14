package com.example.demo.daoimpl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.SubjectTeacherAssignmentDao;

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
}