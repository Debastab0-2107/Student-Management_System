
package com.example.demo.serviceimpl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dao.CAMarksDao;
import com.example.demo.model.CAMarks;
import com.example.demo.service.CAMarksService;

@Service
@Transactional
public class CAMarksServiceImpl implements CAMarksService {

    private final CAMarksDao caMarksDao;

    public CAMarksServiceImpl(CAMarksDao caMarksDao) {
        this.caMarksDao = caMarksDao;
    }

    @Override
    public void saveCAMarks(CAMarks caMarks) {
        if (caMarks == null) {
            throw new IllegalArgumentException("CA marks cannot be null");
        }

        if (caMarks.getStudentId() == null ||
                caMarks.getStudentId().isBlank()) {
            throw new IllegalArgumentException("Student ID is required");
        }

        if (caMarks.getTeacherId() == null ||
                caMarks.getTeacherId().isBlank()) {
            throw new IllegalArgumentException("Teacher ID is required");
        }

        if (caMarks.getSubjectId() == null ||
                caMarks.getSubjectId().isBlank()) {
            throw new IllegalArgumentException("Subject ID is required");
        }

        if (caMarks.getSem() == null || caMarks.getSem().isBlank()) {
            throw new IllegalArgumentException("Semester is required");
        }

        if (caMarks.getCaNo() <= 0) {
            throw new IllegalArgumentException("CA number must be positive");
        }

        if (caMarks.getTotalMarks() == null
                || caMarks.getTotalMarks().signum() < 0
                || caMarks.getTotalMarks().compareTo(
                        java.math.BigDecimal.valueOf(25)) > 0) {

            throw new IllegalArgumentException(
                "CA marks must be between 0 and 25");
        }

        if (caMarks.getMarksId() == null ||
                caMarks.getMarksId().isBlank()) {
            throw new IllegalArgumentException("Marks ID is required");
        }

        caMarksDao.save(caMarks);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CAMarks> getAllCAMarks() {
        return caMarksDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public CAMarks getCAMarksById(String marksId) {
        if (marksId == null || marksId.isBlank()) {
            throw new IllegalArgumentException("Marks ID is required");
        }

        return caMarksDao.findById(marksId);
    }
    

	@Override
	public void saveAllCAMarks(List<CAMarks> records) {
	    if (records == null || records.isEmpty()) {
	        throw new IllegalArgumentException("No CA marks to save");
	    }
	
	    for (CAMarks record : records) {
	        saveCAMarks(record);
	    }
	}

}
