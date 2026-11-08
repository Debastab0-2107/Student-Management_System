
package com.example.demo.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.UniversityIdentifierExcelRow;

@Component
public class UniversityIdentifierExcelParser {

    public List<UniversityIdentifierExcelRow> parse(
            MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Excel file cannot be empty");
        }

        List<UniversityIdentifierExcelRow> rows =
                new ArrayList<>();

        DataFormatter formatter = new DataFormatter();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook =
                     WorkbookFactory.create(inputStream)) {

            if (workbook.getNumberOfSheets() == 0) {
                throw new IllegalArgumentException(
                        "Excel file has no worksheet");
            }

            Sheet sheet = workbook.getSheetAt(0);

            Row header = sheet.getRow(0);

            if (header == null) {
                throw new IllegalArgumentException(
                        "Excel header row is missing");
            }

            String[] expectedHeaders = {
                    "StudentId", "Name", "Roll", "Reg", "Batch"
            };

            for (int i = 0; i < expectedHeaders.length; i++) {

                Cell cell = header.getCell(i);

                String actual = cell == null
                        ? ""
                        : formatter.formatCellValue(cell).trim();

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

                String studentId = getValue(row, 0, formatter);
                String name = getValue(row, 1, formatter);
                String roll = getValue(row, 2, formatter);
                String reg = getValue(row, 3, formatter);
                String batch = getValue(row, 4, formatter);

                if (studentId.isEmpty()
                        && name.isEmpty()
                        && roll.isEmpty()
                        && reg.isEmpty()
                        && batch.isEmpty()) {
                    continue;
                }

                rows.add(new UniversityIdentifierExcelRow(
                        studentId,
                        name,
                        roll,
                        reg,
                        batch));
            }
        }

        return rows;
    }

    private String getValue(
            Row row,
            int column,
            DataFormatter formatter) {

        Cell cell = row.getCell(column);

        if (cell == null) {
            return "";
        }

        return formatter.formatCellValue(cell).trim();
    }
}
