
package com.example.demo.service;

import java.util.List;

import com.example.demo.model.CAMarks;

public interface CAMarksService {

    void saveCAMarks(CAMarks caMarks);

    List<CAMarks> getAllCAMarks();

    CAMarks getCAMarksById(String marksId);
    
    void saveAllCAMarks(List<CAMarks> records);

}
