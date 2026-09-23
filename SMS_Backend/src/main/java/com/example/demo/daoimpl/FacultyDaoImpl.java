package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.FacultyDao;
import com.example.demo.model.Faculty;

@Repository
public class FacultyDaoImpl implements FacultyDao {

    private final SessionFactory sessionFactory;

    public FacultyDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Faculty save(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException("Faculty cannot be null");
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

    @Override
    public Faculty findById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException("Teacher ID cannot be empty");
        }

        Session session = sessionFactory.openSession();

        try {
            return session.get(Faculty.class, teacherId);

        } finally {
            session.close();
        }
    }

    @Override
    public List<Faculty> findAll() {

        Session session = sessionFactory.openSession();

        try {
            return session
                    .createQuery("FROM Faculty", Faculty.class)
                    .getResultList();

        } finally {
            session.close();
        }
    }

    @Override
    public boolean update(Faculty faculty) {

        if (faculty == null) {
            throw new IllegalArgumentException("Faculty cannot be null");
        }

        Session session = sessionFactory.openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            Faculty existingFaculty =
                    session.get(Faculty.class, faculty.getTeacherId());

            if (existingFaculty == null) {
                transaction.rollback();
                return false;
            }

            existingFaculty.setName(faculty.getName());
            existingFaculty.setPhoneNumber(faculty.getPhoneNumber());
            existingFaculty.setFacultyType(faculty.getFacultyType());
            existingFaculty.setDeptId(faculty.getDeptId());
            existingFaculty.setStatus(faculty.isStatus());

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

    @Override
    public boolean deleteById(String teacherId) {

        if (teacherId == null || teacherId.isBlank()) {
            throw new IllegalArgumentException("Teacher ID cannot be empty");
        }

        Session session = sessionFactory.openSession();
        Transaction transaction = null;

        try {
            transaction = session.beginTransaction();

            Faculty faculty =
                    session.get(Faculty.class, teacherId);

            if (faculty == null) {
                transaction.rollback();
                return false;
            }

            session.remove(faculty);

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