package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.MarksDao;
import com.example.demo.model.Marks;

/**
 * Native Hibernate implementation of the MarksDao interface.
 *
 * This class performs CRUD operations on Marks records using
 * Hibernate sessions and explicit transactions.
 */
@Repository
public class MarksDaoImpl implements MarksDao {

    /** Hibernate SessionFactory used to create database sessions. */
    private final SessionFactory sessionFactory;

    /**
     * Creates the MarksDaoImpl with the required Hibernate SessionFactory.
     *
     * @param sessionFactory configured Hibernate SessionFactory
     */
    public MarksDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Saves a new marks record in the database.
     *
     * @param marks marks object to save
     * @return the saved marks object
     */
    @Override
    public Marks save(Marks marks) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction = session.beginTransaction();

            try {
                session.persist(marks);
                transaction.commit();

                return marks;
            } catch (RuntimeException exception) {
                transaction.rollback();
                throw exception;
            }
        }
    }

    /**
     * Finds a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return the matching marks record, or null if not found
     */
    @Override
    public Marks findById(String marksId) {

        try (Session session = sessionFactory.openSession()) {
            return session.get(Marks.class, marksId);
        }
    }

    /**
     * Retrieves all marks records from the database.
     *
     * @return list of all marks records
     */
    @Override
    public List<Marks> findAll() {

        try (Session session = sessionFactory.openSession()) {

            return session
                    .createQuery("FROM Marks", Marks.class)
                    .getResultList();
        }
    }

    /**
     * Updates an existing marks record.
     *
     * @param marks marks object containing updated information
     * @return true if the marks record was found and updated
     */
    @Override
    public boolean update(Marks marks) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction = session.beginTransaction();

            try {
                Marks existingMarks =
                        session.get(Marks.class, marks.getMarksId());

                if (existingMarks == null) {
                    transaction.rollback();
                    return false;
                }

                existingMarks.setStudentId(marks.getStudentId());
                existingMarks.setSubjectId(marks.getSubjectId());
                existingMarks.setMarks(marks.getMarks());

                session.merge(existingMarks);

                transaction.commit();

                return true;

            } catch (RuntimeException exception) {
                transaction.rollback();
                throw exception;
            }
        }
    }

    /**
     * Deletes a marks record using its unique identifier.
     *
     * @param marksId unique marks record identifier
     * @return true if the marks record was found and deleted
     */
    @Override
    public boolean deleteById(String marksId) {

        try (Session session = sessionFactory.openSession()) {

            org.hibernate.Transaction transaction = session.beginTransaction();

            try {
                Marks marks = session.get(Marks.class, marksId);

                if (marks == null) {
                    transaction.rollback();
                    return false;
                }

                session.remove(marks);
                transaction.commit();

                return true;

            } catch (RuntimeException exception) {
                transaction.rollback();
                throw exception;
            }
        }
    }
}