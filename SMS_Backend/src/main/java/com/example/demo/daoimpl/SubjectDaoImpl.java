package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.SubjectDao;
import com.example.demo.model.Subject;

/**
 * Native Hibernate implementation of the SubjectDao interface.
 *
 * This class performs CRUD operations on the Subject entity using
 * Hibernate sessions and explicit transactions.
 */
@Repository
public class SubjectDaoImpl implements SubjectDao {

    /** Hibernate SessionFactory used to create database sessions. */
    private final SessionFactory sessionFactory;

    /**
     * Creates the SubjectDaoImpl with the required Hibernate SessionFactory.
     *
     * @param sessionFactory configured Hibernate SessionFactory
     */
    public SubjectDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Saves a new subject in the database.
     *
     * @param subject subject object to save
     * @return the saved subject
     */
    @Override
    public Subject save(Subject subject) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction = session.beginTransaction();

            try {
                session.persist(subject);
                transaction.commit();

                return subject;
            } catch (RuntimeException exception) {
                transaction.rollback();
                throw exception;
            }
        }
    }

    /**
     * Finds a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return the matching subject, or null if not found
     */
    @Override
    public Subject findById(String subjectId) {

        try (Session session = sessionFactory.openSession()) {
            return session.get(Subject.class, subjectId);
        }
    }

    /**
     * Retrieves all subjects from the database.
     *
     * @return list of all subjects
     */
    @Override
    public List<Subject> findAll() {

        try (Session session = sessionFactory.openSession()) {

            return session
                    .createQuery("FROM Subject", Subject.class)
                    .getResultList();
        }
    }

    /**
     * Updates an existing active subject.
     *
     * Inactive subjects cannot be modified through this method.
     *
     * @param subject updated subject information
     * @return true if the active subject was successfully updated
     */
    @Override
    public boolean update(Subject subject) {

        try (Session session = sessionFactory.openSession()) {

            Transaction transaction = session.beginTransaction();

            try {

                Subject existingSubject =
                        session.get(Subject.class, subject.getSubjectId());

                // Subject does not exist.
                if (existingSubject == null) {
                    transaction.rollback();
                    return false;
                }

                // Prevent modifications to inactive subjects.
                if (!existingSubject.isActive()) {
                    transaction.rollback();
                    return false;
                }

                existingSubject.setSubjectName(subject.getSubjectName());
                existingSubject.setCourseId(subject.getCourseId());
                existingSubject.setSemesterId(subject.getSemesterId());

                transaction.commit();

                return true;

            } catch (RuntimeException exception) {

                if (transaction.isActive()) {
                    transaction.rollback();
                }

                throw exception;
            }
        }
    }

    /**
     * Deactivates a subject using its unique identifier.
     *
     * This method performs a soft deletion instead of physically
     * removing the subject from the database.
     *
     * is_active = 1 : Active subject
     * is_active = 0 : Inactive subject
     *
     * Academic history and references to this subject are preserved.
     *
     * @param subjectId unique subject identifier
     * @return true if the subject exists and is now inactive
     */
    @Override
    public boolean deleteById(String subjectId) {

        try (Session session = sessionFactory.openSession()) {

            Transaction transaction = session.beginTransaction();

            try {

                Subject subject = session.get(Subject.class, subjectId);

                if (subject == null) {
                    transaction.rollback();
                    return false;
                }

                // Avoid unnecessary updates if already inactive.
                if (!subject.isActive()) {
                    transaction.commit();
                    return true;
                }

                // Soft deletion: preserve the database record.
                subject.setActive(false);

                transaction.commit();

                return true;

            } catch (RuntimeException exception) {

                if (transaction.isActive()) {
                    transaction.rollback();
                }

                throw exception;
            }
        }
    }
    
    @Override
    public void saveAll(List<Subject> subjects) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction =
                    session.beginTransaction();

            try {

                for (Subject subject : subjects) {
                    session.persist(subject);
                }

                transaction.commit();

            } catch (RuntimeException exception) {

                transaction.rollback();
                throw exception;
            }
        }
    }
 // All-or-nothing Excel update.
    @Override
    public boolean updateAll(List<Subject> subjects) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            try {
                for (Subject input : subjects) {
                    Subject existing = session.get(
                            Subject.class, input.getSubjectId());

                    if (existing == null || !existing.isActive()) {
                        tx.rollback();
                        return false;
                    }

                    existing.setSubjectName(input.getSubjectName());
                    existing.setCourseId(input.getCourseId());
                    existing.setSemesterId(input.getSemesterId());
                }

                tx.commit();
                return true;

            } catch (RuntimeException e) {
                tx.rollback();
                throw e;
            }
        }
    }

    // All-or-nothing validation, but only active records are changed.
    @Override
    public int deactivateAll(List<String> subjectIds) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            try {
                int count = 0;

                for (String id : subjectIds) {
                    Subject subject = session.get(Subject.class, id);

                    if (subject == null) {
                        tx.rollback();
                        throw new IllegalArgumentException(
                                "Subject not found: " + id);
                    }

                    if (subject.isActive()) {
                        subject.setActive(false);
                        count++;
                    }
                }

                tx.commit();
                return count;

            } catch (RuntimeException e) {
                if (tx.isActive()) {
                    tx.rollback();
                }
                throw e;
            }
        }
    }

    @Override
    public List<Subject> findActiveByCourseId(String courseId) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                    "FROM Subject WHERE courseId = :courseId "
                    + "AND active = true "
                    + "ORDER BY semesterId, subjectId",
                    Subject.class
            ).setParameter("courseId", courseId).getResultList();
        }
    }

    @Override
    public List<Subject> findActiveByCourseAndSemester(
            String courseId, String semesterId) {

        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                    "FROM Subject WHERE courseId = :courseId "
                    + "AND semesterId = :semesterId "
                    + "AND active = true ORDER BY subjectId",
                    Subject.class
            )
            .setParameter("courseId", courseId)
            .setParameter("semesterId", semesterId)
            .getResultList();
        }
    }
}