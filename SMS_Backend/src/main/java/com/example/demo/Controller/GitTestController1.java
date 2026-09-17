package com.example.demo.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GitTestController1 {

    @GetMapping("/git-test-friend1")
    public String gitTestFriend1() {
        return "Git collaboration test successful - Friend 1 priyanshu";
    }
}