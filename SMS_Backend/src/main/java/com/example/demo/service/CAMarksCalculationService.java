
package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class CAMarksCalculationService {

    public double calculateCAMarks(
            List<Double> mcqMarks,
            List<Double> descriptiveMarks) {

        if (mcqMarks == null || mcqMarks.size() != 8) {
            throw new IllegalArgumentException(
                    "Exactly 8 MCQ marks are required");
        }

        if (descriptiveMarks == null ||
                descriptiveMarks.size() != 9) {
            throw new IllegalArgumentException(
                    "Exactly 9 descriptive question marks are required");
        }

        double mcqTotal = 0;

        for (Double mark : mcqMarks) {
            validateMark(mark, 1);
            mcqTotal += mark;
        }

        // Maximum MCQ contribution is 5
        mcqTotal = Math.min(mcqTotal, 5);

        List<Double> validDescriptiveMarks =
                new ArrayList<>(descriptiveMarks);

        for (Double mark : validDescriptiveMarks) {
            validateMark(mark, 5);
        }

        // Select the four highest marks from questions 2–10
        validDescriptiveMarks.sort(Collections.reverseOrder());

        double descriptiveTotal = 0;

        for (int i = 0; i < 4; i++) {
            descriptiveTotal += validDescriptiveMarks.get(i);
        }

        return mcqTotal + descriptiveTotal;
    }

    private void validateMark(Double mark, double maximum) {
        if (mark == null ||
                !Double.isFinite(mark) ||
                mark < 0 ||
                mark > maximum) {
            throw new IllegalArgumentException(
                    "Marks must be between 0 and " + maximum);
        }
    }
}
