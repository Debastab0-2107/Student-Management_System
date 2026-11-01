package com.example.demo.daoimpl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.AdminCredentialsDao;
import com.example.demo.model.AdminCredentials;

@Repository
public class AdminCredentialsDaoImpl implements AdminCredentialsDao {

    private final SessionFactory sessionFactory;

    public AdminCredentialsDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public AdminCredentials findByUsername(String username) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(AdminCredentials.class, username);
    }

    @Override
    public void save(AdminCredentials credentials) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(credentials);
    }

    @Override
    public void update(AdminCredentials credentials) {
        Session session = sessionFactory.getCurrentSession();
        session.merge(credentials);
    }
}