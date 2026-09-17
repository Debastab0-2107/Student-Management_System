package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EnvTestController {

    @Value("${DB_USERNAME}")
    private String username;

    @GetMapping("/test-env")
    public String testEnv() {
        return "Environment loaded successfully. DB Username = " + username;
    }
}