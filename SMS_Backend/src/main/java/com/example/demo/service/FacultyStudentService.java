package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.response.FacultyStudentResponse;

public interface FacultyStudentService {

    List<FacultyStudentResponse> getAllStudents();
}