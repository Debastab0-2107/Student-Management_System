package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
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
     * Updates an existing subject.
     *
     * The existing database record is loaded first and its fields
     * are updated inside an explicit Hibernate transaction.
     *
     * @param subject subject object containing updated information
     * @return true if the subject was found and updated
     */
    @Override
    public boolean update(Subject subject) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction = session.beginTransaction();

            try {
                Subject existingSubject =
                        session.get(Subject.class, subject.getSubjectId());

                if (existingSubject == null) {
                    transaction.rollback();
                    return false;
                }

                existingSubject.setSubjectName(subject.getSubjectName());
                existingSubject.setCourseId(subject.getCourseId());
                existingSubject.setSemesterId(subject.getSemesterId());

                session.merge(existingSubject);

                transaction.commit();

                return true;

            } catch (RuntimeException exception) {
                transaction.rollback();
                throw exception;
            }
        }
    }

    /**
     * Deletes a subject using its unique identifier.
     *
     * @param subjectId unique subject identifier
     * @return true if the subject was found and deleted
     */
    @Override
    public boolean deleteById(String subjectId) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction = session.beginTransaction();

            try {
                Subject subject = session.get(Subject.class, subjectId);

                if (subject == null) {
                    transaction.rollback();
                    return false;
                }

                session.remove(subject);
                transaction.commit();

                return true;

            } catch (RuntimeException exception) {
                transaction.rollback();
                throw exception;
            }
        }
    }
}