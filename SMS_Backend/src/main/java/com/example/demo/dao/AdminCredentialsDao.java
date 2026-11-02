package com.example.demo.dao;

import com.example.demo.model.AdminCredentials;

public interface AdminCredentialsDao {

    AdminCredentials findByUsername(String username);

    void save(AdminCredentials credentials);

    void update(AdminCredentials credentials);
}