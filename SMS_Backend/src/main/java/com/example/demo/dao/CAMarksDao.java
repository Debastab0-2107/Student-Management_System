
package com.example.demo.dao;

import java.util.List;

import com.example.demo.model.CAMarks;

public interface CAMarksDao {

    void save(CAMarks caMarks);

    List<CAMarks> findAll();

    CAMarks findById(String marksId);
}
