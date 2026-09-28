package com.example.demo.util;

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

import com.example.demo.dto.request.FacultyDeactivateExcelRow;
import com.example.demo.dto.request.FacultyExcelRow;

/**
 * FacultyExcelParser
 *
 * Reads and validates Excel files related to Faculty management.
 *
 * Two Excel formats are supported:
 *
 * 1. Regular Faculty Addition
 *
 * teacherId | name | phoneNumber | facultyType | deptId
 *
 * 2. Regular Faculty Deactivation
 *
 * teacherId
 *
 * This class only parses Excel data.
 * Database operations remain in the service/DAO layers.
 */
@Component
public class FacultyExcelParser {

    private final DataFormatter dataFormatter =
            new DataFormatter();

    /**
     * Parses an Excel file containing Regular Faculty records.
     *
     * @param file uploaded Excel file
     * @return parsed faculty rows
     */
    public List<FacultyExcelRow> parseRegularFacultyExcel(
            MultipartFile file) {

        validateFile(file);

        List<FacultyExcelRow> rows =
                new ArrayList<>();

        try (InputStream inputStream =
                     file.getInputStream();
             Workbook workbook =
                     WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            validateRegularHeaders(
                    sheet.getRow(0));

            for (int rowIndex = 1;
                 rowIndex <= sheet.getLastRowNum();
                 rowIndex++) {

                Row row = sheet.getRow(rowIndex);

                if (isEmptyRow(row)) {
                    continue;
                }

                String teacherId =
                        getCellValue(row, 0);

                String name =
                        getCellValue(row, 1);

                String phoneNumber =
                        getCellValue(row, 2);

                String facultyType =
                        getCellValue(row, 3);

                String deptId =
                        getCellValue(row, 4);

                validateRequired(
                        teacherId,
                        "teacherId",
                        rowIndex);

                validateRequired(
                        name,
                        "name",
                        rowIndex);

                validateRequired(
                        facultyType,
                        "facultyType",
                        rowIndex);

                if (!"REGULAR".equalsIgnoreCase(
                        facultyType)) {

                    throw new IllegalArgumentException(
                            "Row " + (rowIndex + 1)
                                    + ": facultyType must be REGULAR");
                }

                rows.add(
                        new FacultyExcelRow(
                                teacherId,
                                name,
                                phoneNumber,
                                facultyType.toUpperCase(),
                                deptId));
            }

            return rows;

        } catch (IllegalArgumentException e) {

            throw e;

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Failed to read Regular Faculty Excel: "
                            + e.getMessage(),
                    e);
        }
    }

    /**
     * Parses an Excel file containing Regular Faculty IDs
     * that must be deactivated.
     *
     * @param file uploaded deactivation Excel
     * @return faculty IDs to deactivate
     */
    public List<FacultyDeactivateExcelRow>
            parseRegularFacultyDeactivationExcel(
                    MultipartFile file) {

        validateFile(file);

        List<FacultyDeactivateExcelRow> rows =
                new ArrayList<>();

        try (InputStream inputStream =
                     file.getInputStream();
             Workbook workbook =
                     WorkbookFactory.create(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            validateDeactivationHeader(
                    sheet.getRow(0));

            for (int rowIndex = 1;
                 rowIndex <= sheet.getLastRowNum();
                 rowIndex++) {

                Row row = sheet.getRow(rowIndex);

                if (isEmptyRow(row)) {
                    continue;
                }

                String teacherId =
                        getCellValue(row, 0);

                validateRequired(
                        teacherId,
                        "teacherId",
                        rowIndex);

                rows.add(
                        new FacultyDeactivateExcelRow(
                                teacherId));
            }

            return rows;

        } catch (IllegalArgumentException e) {

            throw e;

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Failed to read Faculty Deactivation Excel: "
                            + e.getMessage(),
                    e);
        }
    }

    /**
     * Validates the Excel file itself.
     *
     * @param file uploaded file
     */
    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Faculty Excel file cannot be empty");
        }
    }

    /**
     * Validates headers for Regular Faculty import.
     *
     * @param headerRow first Excel row
     */
    private void validateRegularHeaders(
            Row headerRow) {

        if (headerRow == null) {
            throw new IllegalArgumentException(
                    "Faculty Excel header row is missing");
        }

        validateHeader(
                headerRow,
                0,
                "teacherId");

        validateHeader(
                headerRow,
                1,
                "name");

        validateHeader(
                headerRow,
                2,
                "phoneNumber");

        validateHeader(
                headerRow,
                3,
                "facultyType");

        validateHeader(
                headerRow,
                4,
                "deptId");
    }

    /**
     * Validates the single teacherId header used
     * by the deactivation Excel.
     *
     * @param headerRow first Excel row
     */
    private void validateDeactivationHeader(
            Row headerRow) {

        if (headerRow == null) {
            throw new IllegalArgumentException(
                    "Faculty deactivation Excel header is missing");
        }

        validateHeader(
                headerRow,
                0,
                "teacherId");
    }

    /**
     * Validates one Excel header.
     */
    private void validateHeader(
            Row row,
            int columnIndex,
            String expected) {

        String actual =
                getCellValue(row, columnIndex);

        if (!expected.equalsIgnoreCase(actual)) {

            throw new IllegalArgumentException(
                    "Invalid Excel header at column "
                            + (columnIndex + 1)
                            + ". Expected: "
                            + expected);
        }
    }

    /**
     * Reads a cell as text.
     */
    private String getCellValue(
            Row row,
            int columnIndex) {

        if (row == null
                || row.getCell(columnIndex) == null) {
            return "";
        }

        return dataFormatter
                .formatCellValue(
                        row.getCell(columnIndex))
                .trim();
    }

    /**
     * Determines whether an Excel row contains no data.
     */
    private boolean isEmptyRow(Row row) {

        if (row == null) {
            return true;
        }

        for (int i = 0; i < 5; i++) {

            if (!getCellValue(row, i).isBlank()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Validates a required Excel value.
     */
    private void validateRequired(
            String value,
            String field,
            int rowIndex) {

        if (value == null || value.isBlank()) {

            throw new IllegalArgumentException(
                    "Row " + (rowIndex + 1)
                            + ": "
                            + field
                            + " cannot be empty");
        }
    }
}