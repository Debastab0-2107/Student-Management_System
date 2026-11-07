package com.example.demo.daoimpl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.CAMarksDao;
import com.example.demo.model.CAMarks;

/**
 * Hibernate implementation of CAMarksDao.
 *
 * Handles insertion, updating and retrieval of CA records.
 *
 * A complete batch is processed in one database transaction.
 * If any record fails, the complete batch is rolled back.
 */
@Repository
public class CAMarksDaoImpl implements CAMarksDao {

    private final SessionFactory sessionFactory;

    public CAMarksDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * Inserts new CA records or updates existing records.
     *
     * A record is considered existing when the following values match:
     * studentId + subjectId + semester.
     *
     * Existing primary keys are retained during updates.
     *
     * @param records list of CA records
     */
    @Override
    public void saveOrUpdateAll(List<CAMarks> records) {

        if (records == null || records.isEmpty()) {
            throw new IllegalArgumentException(
                    "No CA records were provided.");
        }

        try (Session session = sessionFactory.openSession()) {

            Transaction transaction = session.beginTransaction();

            try {

                for (CAMarks incoming : records) {

                    /*
                     * Find an existing record using the single-CA
                     * business key.
                     */
                    List<CAMarks> existingRecords =
                            session.createQuery(
                                    "FROM CAMarks c "
                                    + "WHERE c.studentId = :studentId "
                                    + "AND c.subjectId = :subjectId "
                                    + "AND c.sem = :semesterId",
                                    CAMarks.class)
                            .setParameter(
                                    "studentId",
                                    incoming.getStudentId())
                            .setParameter(
                                    "subjectId",
                                    incoming.getSubjectId())
                            .setParameter(
                                    "semesterId",
                                    incoming.getSem())
                            .setMaxResults(2)
                            .getResultList();

                    /*
                     * More than one existing record means the database
                     * already contains duplicates. Do not guess which
                     * record should be retained.
                     */
                    if (existingRecords.size() > 1) {

                        throw new IllegalStateException(
                                "Duplicate CA records already exist for "
                                + "student " + incoming.getStudentId()
                                + ", subject " + incoming.getSubjectId()
                                + " and semester " + incoming.getSem()
                                + ". Resolve the duplicates before uploading.");
                    }

                    if (existingRecords.isEmpty()) {

                        /*
                         * First CA upload for this student, subject
                         * and semester. Insert a new record.
                         */
                        session.persist(incoming);

                    } else {

                        /*
                         * A CA record already exists.
                         * Update its marks and teacher, but retain
                         * the original primary key.
                         */
                        CAMarks existing = existingRecords.get(0);

                        existing.setTeacherId(incoming.getTeacherId());
                        existing.setTotalMarks(incoming.getTotalMarks());
                    }
                }

                /*
                 * Commit only after every record has been processed.
                 */
                transaction.commit();

            } catch (RuntimeException exception) {

                /*
                 * Roll back the complete upload if any operation fails.
                 */
                if (transaction.isActive()) {
                    transaction.rollback();
                }

                throw exception;
            }
        }
    }

    /**
     * Retrieves all CA records.
     */
    @Override
    public List<CAMarks> findAll() {

        try (Session session = sessionFactory.openSession()) {

            return session.createQuery(
                    "FROM CAMarks ORDER BY sem, studentId, subjectId",
                    CAMarks.class)
                    .getResultList();
        }
    }

    /**
     * Retrieves a CA record by its primary key.
     */
    @Override
    public CAMarks findById(String marksId) {

        try (Session session = sessionFactory.openSession()) {

            return session.get(CAMarks.class, marksId);
        }
    }

    /**
     * Retrieves all CA records belonging to one student.
     */
    @Override
    public List<CAMarks> findByStudentId(String studentId) {

        try (Session session = sessionFactory.openSession()) {

            return session.createQuery(
                    "FROM CAMarks c "
                    + "WHERE c.studentId = :studentId "
                    + "ORDER BY c.sem, c.subjectId",
                    CAMarks.class)
                    .setParameter("studentId", studentId)
                    .getResultList();
        }
    }

    /**
     * Retrieves all CA records belonging to one semester.
     */
    @Override
    public List<CAMarks> findBySemesterId(String semesterId) {

        try (Session session = sessionFactory.openSession()) {

            return session.createQuery(
                    "FROM CAMarks c "
                    + "WHERE c.sem = :semesterId "
                    + "ORDER BY c.studentId, c.subjectId",
                    CAMarks.class)
                    .setParameter("semesterId", semesterId)
                    .getResultList();
        }
    }
}