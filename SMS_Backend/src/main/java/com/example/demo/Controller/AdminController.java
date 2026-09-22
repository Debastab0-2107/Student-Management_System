package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.service.AdminService;

/*
 * AdminController
 * ---------------
 * Handles administrator-related HTTP requests.
 *
 * Controller responsibility:
 *      HTTP Request
 *          ↓
 *      AdminController
 *          ↓
 *      AdminService
 *          ↓
 *      AdminServiceImpl
 *
 * Administrative business logic should remain inside the
 * service layer.
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    /*
     * Service responsible for administrator operations.
     */
    private final AdminService adminService;

    /*
     * Constructor-based dependency injection.
     */
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /*
     * Basic administrator endpoint.
     *
     * HTTP:
     * GET /admin/status
     *
     * This endpoint can be used to verify that an authenticated
     * administrator can reach the administrator section.
     *
     * The actual administrator operations specified by the SRS
     * should be added here once their exact requirements are
     * established.
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse> status() {

        /*
         * Ask the service layer for the administrator status.
         */
        ApiResponse response = adminService.getStatus();

        /*
         * Return the service response to the client.
         */
        return ResponseEntity.ok(response);
    }
}