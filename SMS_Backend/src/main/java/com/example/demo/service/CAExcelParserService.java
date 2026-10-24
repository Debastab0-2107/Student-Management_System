
package com.example.demo.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CAExcelParserService {

    private final DataFormatter formatter = new DataFormatter();

    public List<CAExcelRow> parse(MultipartFile file)
            throws IOException {

        List<CAExcelRow> rows = new ArrayList<>();

        try (InputStream input = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(input)) {

            Sheet sheet = workbook.getSheetAt(0);

            if (sheet.getPhysicalNumberOfRows() < 2) {
                throw new IllegalArgumentException(
                        "Excel file contains no student data");
            }

            Row header = sheet.getRow(0);

            String[] expectedHeaders = {
                "studentId", "teacherId", "subject_id",
                "1a", "1b", "1c", "1d", "1e", "1f", "1g", "1h",
                "2", "3", "4", "5", "6", "7", "8", "9", "10"
            };

            for (int i = 0; i < expectedHeaders.length; i++) {
                String actual = formatter.formatCellValue(
                        header == null ? null : header.getCell(i)).trim();

                if (!expectedHeaders[i].equalsIgnoreCase(actual)) {
                    throw new IllegalArgumentException(
                            "Expected column " + (i + 1) + " to be "
                            + expectedHeaders[i] + ", but found: " + actual);
                }
            }

            for (int rowIndex = 1;
                 rowIndex <= sheet.getLastRowNum();
                 rowIndex++) {

                Row row = sheet.getRow(rowIndex);

                if (row == null || isBlank(row)) {
                    continue;
                }

                CAExcelRow record = new CAExcelRow();

                record.setStudentId(text(row, 0));
                record.setTeacherId(text(row, 1));
                record.setSubjectId(text(row, 2));

                List<Double> mcqs = new ArrayList<>();
                for (int col = 3; col <= 10; col++) {
                    mcqs.add(number(row, col));
                }

                List<Double> descriptive = new ArrayList<>();
                for (int col = 11; col <= 19; col++) {
                    descriptive.add(number(row, col));
                }

                record.setMcqMarks(mcqs);
                record.setDescriptiveMarks(descriptive);

                rows.add(record);
            }
        }

        if (rows.isEmpty()) {
            throw new IllegalArgumentException(
                    "No student records found in the Excel file");
        }

        return rows;
    }

    private String text(Row row, int col) {
        Cell cell = row.getCell(col);
        String value = formatter.formatCellValue(cell).trim();

        if (value.isEmpty()) {
            throw new IllegalArgumentException(
                    "Missing required value at row "
                    + (row.getRowNum() + 1)
                    + ", column " + (col + 1));
        }

        return value;
    }

    private double number(Row row, int col) {
        Cell cell = row.getCell(col);

        if (cell == null ||
                formatter.formatCellValue(cell).trim().isEmpty()) {
            return 0.0;
        }

        try {
            double value = Double.parseDouble(
                    formatter.formatCellValue(cell).trim());

            if (!Double.isFinite(value)) {
                throw new NumberFormatException();
            }

            return value;

        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                    "Invalid numeric mark at row "
                    + (row.getRowNum() + 1)
                    + ", column " + (col + 1));
        }
    }

    private boolean isBlank(Row row) {
        for (Cell cell : row) {
            if (!formatter.formatCellValue(cell).trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }
}
