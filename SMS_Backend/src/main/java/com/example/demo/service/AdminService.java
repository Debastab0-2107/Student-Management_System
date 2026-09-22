package com.example.demo.service;

import com.example.demo.dto.response.ApiResponse;

/*
 * AdminService
 * ------------
 * Defines business operations related to the administrator
 * section of the Student Management System.
 *
 * Controller
 *     ↓
 * AdminService
 *     ↓
 * AdminServiceImpl
 *
 * Administrative business logic belongs in the service layer.
 */
public interface AdminService {

    /*
     * Returns the current administrator section status.
     *
     * This operation provides the initial service contract for
     * the Admin module.
     *
     * Additional administrator operations will be added here
     * according to the actual Admin requirements from the SRS.
     */
    ApiResponse getStatus();
}