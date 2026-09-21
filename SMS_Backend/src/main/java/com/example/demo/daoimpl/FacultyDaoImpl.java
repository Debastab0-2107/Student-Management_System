package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;

/**
 * Hibernate-based implementation of the FacultyDao interface.
 *
 * This class performs database operations for the Faculty entity
 * using Hibernate Session and SessionFactory.
 */
public class FacultyDaoImpl implements FacultyDao {

    /*
     * SessionFactory is responsible for creating Hibernate Sessions.
     *
     * The actual SessionFactory configuration will be handled
     * by the project's Hibernate/database configuration.
     */
    private SessionFactory sessionFactory;

    /**
     * Constructor used to provide the Hibernate SessionFactory.
     *
     * @param sessionFactory configured Hibernate SessionFactory
     */
    public FacultyDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Saves a new Faculty record into the database.
     *
     * @param faculty Faculty object to save
     * @return the saved Faculty object
     */
    @Override
    public Faculty save(Faculty faculty) {

        Transaction transaction = null;

        try (Session session = sessionFactory.openSession()) {

            // Start a database transaction.
            transaction = session.beginTransaction();

            // Persist the Faculty object using Hibernate.
            session.persist(faculty);

            // Commit the transaction so the data is stored.
            transaction.commit();

            return faculty;

        } catch (Exception e) {

            // Roll back the transaction if something goes wrong.
            if (transaction != null) {
                transaction.rollback();
            }

            throw e;
        }
    }

    /**
     * Finds a Faculty record using its teacher ID.
     *
     * @param teacherId unique teacher ID
     * @return matching Faculty object, or null if not found
     */
    @Override
    public Faculty findById(String teacherId) {

        try (Session session = sessionFactory.openSession()) {

            /*
             * Hibernate loads the Faculty object using its identifier.
             *
             * This assumes teacherId is configured as the Faculty
             * identifier in the Hibernate mapping.
             */
            return session.get(Faculty.class, teacherId);
        }
    }

    /**
     * Retrieves all Faculty records from the database.
     *
     * @return list containing all Faculty records
     */
    @Override
    public List<Faculty> findAll() {

        try (Session session = sessionFactory.openSession()) {

            /*
             * HQL works with the Java class name (Faculty),
             * not directly with the database table name.
             */
            return session
                    .createQuery("FROM Faculty", Faculty.class)
                    .getResultList();
        }
    }

    /**
     * Updates an existing Faculty record.
     *
     * @param faculty Faculty object containing updated information
     * @return true if the update is successful
     */
    @Override
    public boolean update(Faculty faculty) {

        Transaction transaction = null;

        try (Session session = sessionFactory.openSession()) {

            // Start the transaction.
            transaction = session.beginTransaction();

            /*
             * merge() copies the updated Faculty data into
             * the persistent Hibernate object.
             */
            session.merge(faculty);

            // Commit the changes to the database.
            transaction.commit();

            return true;

        } catch (Exception e) {

            // Undo the transaction if an error occurs.
            if (transaction != null) {
                transaction.rollback();
            }

            return false;
        }
    }

    /**
     * Deletes a Faculty record using its teacher ID.
     *
     * @param teacherId unique teacher ID
     * @return true if the record is deleted, otherwise false
     */
    @Override
    public boolean deleteById(String teacherId) {

        Transaction transaction = null;

        try (Session session = sessionFactory.openSession()) {

            // Start the transaction.
            transaction = session.beginTransaction();

            // Find the Faculty record first.
            Faculty faculty = session.get(Faculty.class, teacherId);

            /*
             * Only delete when a matching Faculty record exists.
             */
            if (faculty == null) {
                transaction.rollback();
                return false;
            }

            // Delete the Faculty object from the database.
            session.remove(faculty);

            // Commit the deletion.
            transaction.commit();

            return true;

        } catch (Exception e) {

            // Roll back if the deletion fails.
            if (transaction != null) {
                transaction.rollback();
            }

            return false;
        }
    }
}