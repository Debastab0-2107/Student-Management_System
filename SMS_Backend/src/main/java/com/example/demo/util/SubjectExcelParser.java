package com.example.demo.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.SubjectExcelRow;

@Component
public class SubjectExcelParser {

    public List<SubjectExcelRow> parse(MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Excel file cannot be empty.");
        }

        String filename = file.getOriginalFilename();

        if (filename == null
                || !filename.toLowerCase().endsWith(".xlsx")) {
            throw new IllegalArgumentException(
                    "Only .xlsx files are supported.");
        }

        List<SubjectExcelRow> subjects = new ArrayList<>();

        DataFormatter formatter = new DataFormatter();

        try (InputStream input = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(input)) {

            if (workbook.getNumberOfSheets() == 0) {
                throw new IllegalArgumentException(
                        "Excel file contains no worksheet.");
            }

            Sheet sheet = workbook.getSheetAt(0);

            Row header = sheet.getRow(0);

            if (header == null) {
                throw new IllegalArgumentException(
                        "Excel header row is missing.");
            }

            String[] expectedHeaders = {
                "subjectId",
                "subjectName",
                "courseId",
                "semesterId"
            };

            for (int i = 0; i < expectedHeaders.length; i++) {

                String actual = formatter.formatCellValue(
                        header.getCell(i)).trim();

                if (!expectedHeaders[i].equalsIgnoreCase(actual)) {
                    throw new IllegalArgumentException(
                            "Invalid Excel header at column "
                            + (i + 1)
                            + ". Expected: "
                            + expectedHeaders[i]);
                }
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                String subjectId = value(row, 0, formatter);
                String subjectName = value(row, 1, formatter);
                String courseId = value(row, 2, formatter);
                String semesterId = value(row, 3, formatter);

                if (subjectId.isBlank()
                        && subjectName.isBlank()
                        && courseId.isBlank()
                        && semesterId.isBlank()) {
                    continue;
                }

                if (subjectId.isBlank()
                        || subjectName.isBlank()
                        || courseId.isBlank()
                        || semesterId.isBlank()) {

                    throw new IllegalArgumentException(
                            "Missing required value at Excel row "
                            + (i + 1));
                }

                subjects.add(new SubjectExcelRow(
                        subjectId,
                        subjectName,
                        courseId,
                        semesterId));
            }
        }

        if (subjects.isEmpty()) {
            throw new IllegalArgumentException(
                    "No subject records found in the Excel file.");
        }

        return subjects;
    }

    private String value(
            Row row,
            int column,
            DataFormatter formatter) {

        if (row.getCell(column) == null) {
            return "";
        }

        return formatter.formatCellValue(
                row.getCell(column)).trim();
    }


public List<String> parseSubjectIds(MultipartFile file)
        throws IOException {

    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException(
                "Excel file cannot be empty.");
    }

    String filename = file.getOriginalFilename();

    if (filename == null
            || !filename.toLowerCase().endsWith(".xlsx")) {
        throw new IllegalArgumentException(
                "Only .xlsx files are supported.");
    }

    List<String> ids = new ArrayList<>();
    DataFormatter formatter = new DataFormatter();

    try (InputStream input = file.getInputStream();
         Workbook workbook = WorkbookFactory.create(input)) {

        if (workbook.getNumberOfSheets() == 0) {
            throw new IllegalArgumentException(
                    "Excel file contains no worksheet.");
        }

        Sheet sheet = workbook.getSheetAt(0);
        Row header = sheet.getRow(0);

        if (header == null
                || !"subjectId".equalsIgnoreCase(
                        formatter.formatCellValue(
                                header.getCell(0)).trim())) {

            throw new IllegalArgumentException(
                    "Excel must contain subjectId as its first header.");
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {

            Row row = sheet.getRow(i);

            if (row == null) {
                continue;
            }

            String id = formatter.formatCellValue(
                    row.getCell(0)).trim();

            if (id.isBlank()) {
                continue;
            }

            ids.add(id);
        }
    }

    if (ids.isEmpty()) {
        throw new IllegalArgumentException(
                "No subject IDs found in Excel.");
    }

    return ids;
}

}