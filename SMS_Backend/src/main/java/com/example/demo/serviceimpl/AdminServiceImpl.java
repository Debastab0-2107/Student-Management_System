package com.example.demo.serviceimpl;

import org.springframework.stereotype.Service;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.service.AdminService;

/*
 * AdminServiceImpl
 * ----------------
 * Concrete implementation of AdminService.
 *
 * Flow:
 *
 * AdminController
 *      ↓
 * AdminService
 *      ↓
 * AdminServiceImpl
 *
 * Administrator business logic belongs here rather than
 * inside AdminController.
 */
@Service
public class AdminServiceImpl implements AdminService {

    /*
     * Returns the current administrator module status.
     *
     * This gives us a real working Admin service endpoint while
     * keeping the service contract independent of HTTP details.
     */
    @Override
    public ApiResponse getStatus() {

        /*
         * The administrator module is available when this service
         * can successfully execute.
         */
        return new ApiResponse(
                true,
                "Administrator service is running");
    }
}