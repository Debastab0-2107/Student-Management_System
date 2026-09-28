package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;

/**
 * FacultyDaoImpl
 *
 * Hibernate-based implementation of FacultyDao.
 *
 * This class performs all database operations for Faculty.
 *
 * Architecture:
 *
 * FacultyController
 *       ↓
 * FacultyService
 *       ↓
 * FacultyDao
 *       ↓
 * FacultyDaoImpl
 *       ↓
 * Hibernate
 *       ↓
 * MySQL
 */
@Repository
public class FacultyDaoImpl implements FacultyDao {

    private final SessionFactory sessionFactory;

    /**
     * Constructor-based dependency injection.
     *
     * @param sessionFactory Hibernate SessionFactory
     */
    public FacultyDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Saves a new faculty record.
     *
     * @param faculty faculty object
     * @return saved faculty
     */
    @Override
    public Faculty save(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException(
                    "Faculty cannot be null");
        }

        Session session = sessionFactory.openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            session.persist(faculty);

            transaction.commit();

            return faculty;

        } catch (Exception e) {

            if (transaction != null) {
                transaction.rollback();
            }

            throw e;

        } finally {
            session.close();
        }
    }

    /**
     * Finds a faculty member by teacher ID.
     *
     * @param teacherId faculty identifier
     * @return faculty if found, otherwise null
     */
    @Override
    public Faculty findById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID cannot be empty");
        }

        Session session = sessionFactory.openSession();

        try {
            return session.get(Faculty.class, teacherId);

        } finally {
            session.close();
        }
    }

    /**
     * Checks whether a faculty record exists.
     *
     * @param teacherId faculty identifier
     * @return true if record exists
     */
    @Override
    public boolean existsById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            return false;
        }

        Session session = sessionFactory.openSession();

        try {
            Faculty faculty =
                    session.get(Faculty.class, teacherId);

            return faculty != null;

        } finally {
            session.close();
        }
    }

    /**
     * Retrieves every faculty record.
     *
     * Active and inactive records are both returned.
     *
     * @return all faculty records
     */
    @Override
    public List<Faculty> findAll() {

        Session session = sessionFactory.openSession();

        try {
            return session
                    .createQuery(
                            "FROM Faculty",
                            Faculty.class)
                    .getResultList();

        } finally {
            session.close();
        }
    }

    /**
     * Updates an existing faculty record.
     *
     * @param faculty updated faculty object
     * @return true if updated
     */
    @Override
    public boolean update(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException(
                    "Faculty cannot be null");
        }

        Session session = sessionFactory.openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            Faculty existingFaculty =
                    session.get(
                            Faculty.class,
                            faculty.getTeacherId());

            if (existingFaculty == null) {
                transaction.rollback();
                return false;
            }

            existingFaculty.setName(
                    faculty.getName());

            existingFaculty.setPhoneNumber(
                    faculty.getPhoneNumber());

            existingFaculty.setFacultyType(
                    faculty.getFacultyType());

            existingFaculty.setDeptId(
                    faculty.getDeptId());

            existingFaculty.setStatus(
                    faculty.isStatus());

            transaction.commit();

            return true;

        } catch (Exception e) {

            if (transaction != null) {
                transaction.rollback();
            }

            throw e;

        } finally {
            session.close();
        }
    }

    /**
     * Deactivates a faculty record.
     *
     * The record remains in the database so that historical
     * academic information is not disconnected from the faculty.
     *
     * @param teacherId faculty identifier
     * @return true if deactivated
     */
    @Override
    public boolean deactivateById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException(
                    "Teacher ID cannot be empty");
        }

        Session session = sessionFactory.openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            Faculty faculty =
                    session.get(
                            Faculty.class,
                            teacherId);

            if (faculty == null) {
                transaction.rollback();
                return false;
            }

            faculty.setStatus(false);

            transaction.commit();

            return true;

        } catch (Exception e) {

            if (transaction != null) {
                transaction.rollback();
            }

            throw e;

        } finally {
            session.close();
        }
    }
}