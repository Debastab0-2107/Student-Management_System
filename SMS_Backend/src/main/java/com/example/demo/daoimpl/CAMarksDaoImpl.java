
package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.CAMarksDao;
import com.example.demo.model.CAMarks;

/**
 * Data access implementation for CA marks.
 *
 * Hibernate sessions and transactions are managed explicitly to avoid
 * relying on a thread-bound current-session context.
 */
@Repository
public class CAMarksDaoImpl implements CAMarksDao {

    private final SessionFactory sessionFactory;

    public CAMarksDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Saves one CA marks record.
     */
    @Override
    public void save(CAMarks caMarks) {
        executeInTransaction(session -> session.persist(caMarks));
    }

    /**
     * Retrieves all CA marks records.
     */
    @Override
    public List<CAMarks> findAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery(
                    "FROM CAMarks", CAMarks.class
            ).getResultList();
        }
    }

    /**
     * Retrieves a CA marks record by its identifier.
     */
    @Override
    public CAMarks findById(String marksId) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(CAMarks.class, marksId);
        }
    }

    /**
     * Executes a database operation inside an explicit Hibernate transaction.
     */
    private void executeInTransaction(
            java.util.function.Consumer<Session> operation) {

        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();

            try {
                operation.accept(session);
                transaction.commit();
            } catch (RuntimeException exception) {
                if (transaction.isActive()) {
                    transaction.rollback();
                }
                throw exception;
            }
        }
    }
}
