package com.example.demo.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SubjectTeacherAssignmentExcelParser {
    private static final String[] HEADERS = {
        "teacherId", "subjectId", "sessionId", "action"
    };
    private final DataFormatter formatter = new DataFormatter();

    public List<SubjectTeacherAssignmentExcelRow> parse(MultipartFile file)
            throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a non-empty Excel file.");
        }

        List<SubjectTeacherAssignmentExcelRow> result = new ArrayList<>();
        try (InputStream input = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(input)) {
            if (workbook.getNumberOfSheets() == 0) {
                throw new IllegalArgumentException("Excel workbook has no sheets.");
            }
            Sheet sheet = workbook.getSheetAt(0);
            Row header = sheet.getRow(0);
            if (header == null) {
                throw new IllegalArgumentException("Excel header row is missing.");
            }
            for (int col = 0; col < HEADERS.length; col++) {
                String actual = formatter.formatCellValue(header.getCell(col)).trim();
                if (!HEADERS[col].equalsIgnoreCase(actual)) {
                    throw new IllegalArgumentException("Column " + (col + 1)
                            + " must be named '" + HEADERS[col] + "'. Found: '" + actual + "'.");
                }
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isBlank(row)) continue;
                SubjectTeacherAssignmentExcelRow item = new SubjectTeacherAssignmentExcelRow();
                item.setTeacherId(value(row, 0, i));
                item.setSubjectId(value(row, 1, i));
                item.setSessionId(value(row, 2, i));
                item.setAction(value(row, 3, i).toUpperCase());
                if (!item.getAction().equals("ASSIGN") && !item.getAction().equals("DEACTIVATE")) {
                    throw new IllegalArgumentException("Invalid action at Excel row "
                            + (i + 1) + ". Use ASSIGN or DEACTIVATE.");
                }
                result.add(item);
            }
        } catch (org.apache.poi.EncryptedDocumentException ex) {
            throw new IllegalArgumentException("The Excel file is encrypted and cannot be read.", ex);
        }
        if (result.isEmpty()) {
            throw new IllegalArgumentException("No assignment rows were found in the workbook.");
        }
        return result;
    }

    private String value(Row row, int column, int rowIndex) {
        String value = formatter.formatCellValue(row.getCell(column)).trim();
        if (value.isEmpty()) {
            throw new IllegalArgumentException("Missing value at Excel row "
                    + (rowIndex + 1) + ", column " + (column + 1) + ".");
        }
        return value;
    }

    private boolean isBlank(Row row) {
        for (int i = 0; i < HEADERS.length; i++) {
            if (!formatter.formatCellValue(row.getCell(i)).trim().isEmpty()) return false;
        }
        return true;
    }
}