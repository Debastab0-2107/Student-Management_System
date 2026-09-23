package com.example.demo.daoimpl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.StudentDao;
import com.example.demo.model.Student;

@Repository
public class StudentDaoImpl implements StudentDao {

    private final SessionFactory sessionFactory;

    public StudentDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Student findByStudentId(String studentId) {

        if (studentId == null || studentId.isBlank()) {
            throw new IllegalArgumentException(
                    "Student ID cannot be empty");
        }

        Session session = sessionFactory.openSession();

        try {
            return session.get(Student.class, studentId);

        } finally {
            session.close();
        }
    }
}