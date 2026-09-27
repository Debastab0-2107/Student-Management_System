package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.StudentDao;
import com.example.demo.model.Student;

/**
 * StudentDaoImpl
 *
 * Hibernate-based implementation of StudentDao.
 *
 * This class performs database operations for the Student entity
 * using native Hibernate Session and HQL.
 *
 * Spring Data JPA is intentionally not used.
 *
 * Important security/design rule:
 *
 * Student profile updates are restricted to student-editable fields.
 * Authority-controlled fields such as studentId, name, phoneNumber,
 * courseId, and sessionId are never modified by updateStudentProfile().
 */
@Repository
public class StudentDaoImpl implements StudentDao {

    /*
     * Hibernate SessionFactory used to create database sessions.
     */
    private final SessionFactory sessionFactory;

    /**
     * Creates the StudentDaoImpl with the application's
     * Hibernate SessionFactory.
     *
     * @param sessionFactory configured Hibernate SessionFactory
     */
    public StudentDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Saves a new student record.
     *
     * This method is mainly used by the Excel import workflow.
     *
     * @param student student object to save
     * @return saved student
     */
    @Override
    public Student save(Student student) {

        Transaction transaction = null;

        try (Session session = sessionFactory.openSession()) {

            transaction = session.beginTransaction();

            session.persist(student);

            transaction.commit();

            return student;

        } catch (Exception e) {

            if (transaction != null) {
                transaction.rollback();
            }

            throw new RuntimeException(
                    "Failed to save student with ID: "
                            + student.getStudentId(),
                    e);
        }
    }

    /**
     * Finds a student by the authority-assigned student ID.
     *
     * @param studentId authority-assigned student ID
     * @return matching student, or null when not found
     */
    @Override
    public Student findByStudentId(String studentId) {

        try (Session session = sessionFactory.openSession()) {

            String hql =
                    "FROM Student s WHERE s.studentId = :studentId";

            return session.createQuery(hql, Student.class)
                    .setParameter("studentId", studentId)
                    .uniqueResult();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to find student with ID: "
                            + studentId,
                    e);
        }
    }

    /**
     * Checks whether a student already exists with the supplied
     * authority-assigned student ID.
     *
     * @param studentId student ID to check
     * @return true when the student exists, otherwise false
     */
    @Override
    public boolean existsByStudentId(String studentId) {

        try (Session session = sessionFactory.openSession()) {

            String hql =
                    "SELECT COUNT(s) "
                    + "FROM Student s "
                    + "WHERE s.studentId = :studentId";

            Long count = session.createQuery(hql, Long.class)
                    .setParameter("studentId", studentId)
                    .uniqueResult();

            return count != null && count > 0;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to check student ID: "
                            + studentId,
                    e);
        }
    }

    /**
     * Retrieves all student records.
     *
     * @return list containing all students
     */
    @Override
    public List<Student> findAll() {

        try (Session session = sessionFactory.openSession()) {

            String hql =
                    "FROM Student s ORDER BY s.studentId";

            return session.createQuery(hql, Student.class)
                    .getResultList();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to retrieve students",
                    e);
        }
    }

    /**
     * Updates only student-editable profile fields.
     *
     * The authority-controlled fields are intentionally excluded
     * from this HQL UPDATE statement.
     *
     * Therefore this operation cannot change:
     *
     * - studentId
     * - name
     * - phoneNumber
     * - courseId
     * - sessionId
     *
     * @param studentId authority-assigned student ID
     * @param email student's email
     * @param dateOfBirth student's date of birth
     * @param fatherName father's name
     * @param fatherPhoneNumber father's phone number
     * @param motherName mother's name
     * @param motherPhoneNumber mother's phone number
     * @return true if a student record was updated
     */
    @Override
    public boolean updateStudentProfile(
            String studentId,
            String email,
            String dateOfBirth,
            String fatherName,
            String fatherPhoneNumber,
            String motherName,
            String motherPhoneNumber) {

        Transaction transaction = null;

        try (Session session = sessionFactory.openSession()) {

            transaction = session.beginTransaction();

            String hql =
                    "UPDATE Student SET "
                    + "email = :email, "
                    + "dateOfBirth = :dateOfBirth, "
                    + "fatherName = :fatherName, "
                    + "fatherPhoneNumber = :fatherPhoneNumber, "
                    + "motherName = :motherName, "
                    + "motherPhoneNumber = :motherPhoneNumber "
                    + "WHERE studentId = :studentId";

            int updatedRows = session.createMutationQuery(hql)
                    .setParameter("email", email)
                    .setParameter("dateOfBirth", dateOfBirth)
                    .setParameter("fatherName", fatherName)
                    .setParameter("fatherPhoneNumber", fatherPhoneNumber)
                    .setParameter("motherName", motherName)
                    .setParameter("motherPhoneNumber", motherPhoneNumber)
                    .setParameter("studentId", studentId)
                    .executeUpdate();

            transaction.commit();

            return updatedRows > 0;

        } catch (Exception e) {

            if (transaction != null) {
                transaction.rollback();
            }

            throw new RuntimeException(
                    "Failed to update profile for student ID: "
                            + studentId,
                    e);
        }
    }

    /**
     * Updates the student's BCrypt password hash.
     *
     * The plain-text password is never sent to the database.
     *
     * @param studentId authority-assigned student ID
     * @param passwordHash BCrypt password hash
     * @param mustChangePassword whether the initial password must
     *                           still be changed
     * @return true if the password was updated
     */
    @Override
    public boolean updatePassword(
            String studentId,
            String passwordHash,
            boolean mustChangePassword) {

        Transaction transaction = null;

        try (Session session = sessionFactory.openSession()) {

            transaction = session.beginTransaction();

            String hql =
                    "UPDATE Student SET "
                    + "passwordHash = :passwordHash, "
                    + "mustChangePassword = :mustChangePassword "
                    + "WHERE studentId = :studentId";

            int updatedRows = session.createMutationQuery(hql)
                    .setParameter("passwordHash", passwordHash)
                    .setParameter(
                            "mustChangePassword",
                            mustChangePassword)
                    .setParameter("studentId", studentId)
                    .executeUpdate();

            transaction.commit();

            return updatedRows > 0;

        } catch (Exception e) {

            if (transaction != null) {
                transaction.rollback();
            }

            throw new RuntimeException(
                    "Failed to update password for student ID: "
                            + studentId,
                    e);
        }
    }
}