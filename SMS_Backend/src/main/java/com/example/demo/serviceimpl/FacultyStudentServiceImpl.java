package com.example.demo.serviceimpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.StudentDao;
import com.example.demo.dto.response.FacultyStudentResponse;
import com.example.demo.model.Student;
import com.example.demo.service.FacultyStudentService;

@Service
public class FacultyStudentServiceImpl
        implements FacultyStudentService {

    private final StudentDao studentDao;

    public FacultyStudentServiceImpl(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacultyStudentResponse> getAllStudents() {

        List<Student> students = studentDao.findAll();

        return students.stream()
                .map(FacultyStudentResponse::new)
                .collect(Collectors.toList());
    }
}