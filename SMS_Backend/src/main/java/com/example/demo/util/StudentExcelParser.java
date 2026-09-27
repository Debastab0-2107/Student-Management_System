package com.example.demo.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.StudentExcelRow;

/**
 * StudentExcelParser
 *
 * Reads the authority-provided Excel file and converts each
 * student row into a StudentExcelRow object.
 *
 * Expected Excel columns:
 *
 * studentId | name | phoneNumber | courseId | sessionId
 *
 * The Excel file does NOT contain a password column.
 *
 * The initial student password is assigned by StudentService.
 *
 * This class is registered as a Spring component so that it can
 * be injected into AdminServiceImpl.
 */
@Component
public class StudentExcelParser {

    /**
     * Reads all student rows from the uploaded Excel file.
     *
     * The first row is treated as the header row.
     * Empty rows are ignored.
     *
     * @param file uploaded Excel file
     * @return list of parsed student rows
     * @throws IOException when the Excel file cannot be read
     */
    public List<StudentExcelRow> parse(MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Excel file cannot be empty");
        }

        List<StudentExcelRow> students =
                new ArrayList<>();

        /*
         * DataFormatter converts different Excel cell types
         * into readable String values.
         */
        DataFormatter formatter =
                new DataFormatter();

        /*
         * Open the uploaded Excel workbook.
         */
        try (InputStream inputStream =
                     file.getInputStream();
             Workbook workbook =
                     WorkbookFactory.create(inputStream)) {

            /*
             * Make sure the workbook contains at least one sheet.
             */
            if (workbook.getNumberOfSheets() == 0) {
                throw new IllegalArgumentException(
                        "Excel file does not contain any worksheet");
            }

            /*
             * Use the first worksheet.
             */
            Sheet sheet =
                    workbook.getSheetAt(0);

            /*
             * Row 0 must contain the Excel headers.
             */
            Row headerRow =
                    sheet.getRow(0);

            if (headerRow == null) {
                throw new IllegalArgumentException(
                        "Excel file does not contain a header row");
            }

            /*
             * Validate the required headers.
             */
            validateHeaders(
                    headerRow,
                    formatter);

            /*
             * Read student data starting from row 1.
             */
            for (int rowIndex = 1;
                 rowIndex <= sheet.getLastRowNum();
                 rowIndex++) {

                Row row =
                        sheet.getRow(rowIndex);

                /*
                 * Ignore completely empty rows.
                 */
                if (isEmptyRow(
                        row,
                        formatter)) {

                    continue;
                }

                /*
                 * Read the five authority-controlled fields.
                 */
                String studentId =
                        getCellValue(
                                row,
                                0,
                                formatter);

                String name =
                        getCellValue(
                                row,
                                1,
                                formatter);

                String phoneNumber =
                        getCellValue(
                                row,
                                2,
                                formatter);

                String courseId =
                        getCellValue(
                                row,
                                3,
                                formatter);

                String sessionId =
                        getCellValue(
                                row,
                                4,
                                formatter);

                /*
                 * Convert the Excel row into our DTO.
                 */
                StudentExcelRow studentExcelRow =
                        new StudentExcelRow(
                                studentId,
                                name,
                                phoneNumber,
                                courseId,
                                sessionId);

                students.add(studentExcelRow);
            }
        }

        return students;
    }

    /**
     * Validates the Excel header row.
     *
     * Required header order:
     *
     * Column 1 -> studentId
     * Column 2 -> name
     * Column 3 -> phoneNumber
     * Column 4 -> courseId
     * Column 5 -> sessionId
     *
     * @param headerRow Excel header row
     * @param formatter Excel cell formatter
     */
    private void validateHeaders(
            Row headerRow,
            DataFormatter formatter) {

        String[] expectedHeaders = {
                "studentId",
                "name",
                "phoneNumber",
                "courseId",
                "sessionId"
        };

        for (int index = 0;
             index < expectedHeaders.length;
             index++) {

            String actualHeader =
                    getCellValue(
                            headerRow,
                            index,
                            formatter);

            if (!expectedHeaders[index]
                    .equalsIgnoreCase(
                            actualHeader.trim())) {

                throw new IllegalArgumentException(
                        "Invalid Excel header at column "
                                + (index + 1)
                                + ". Expected: "
                                + expectedHeaders[index]
                                + ", Found: "
                                + actualHeader);
            }
        }
    }

    /**
     * Reads an individual Excel cell as a String.
     *
     * @param row Excel row
     * @param columnIndex zero-based column index
     * @param formatter Excel cell formatter
     * @return cell value as String
     */
    private String getCellValue(
            Row row,
            int columnIndex,
            DataFormatter formatter) {

        if (row == null) {
            return "";
        }

        Cell cell =
                row.getCell(columnIndex);

        if (cell == null) {
            return "";
        }

        return formatter
                .formatCellValue(cell)
                .trim();
    }

    /**
     * Checks whether an Excel row is completely empty.
     *
     * @param row Excel row
     * @param formatter Excel cell formatter
     * @return true when all required cells are empty
     */
    private boolean isEmptyRow(
            Row row,
            DataFormatter formatter) {

        if (row == null) {
            return true;
        }

        for (int columnIndex = 0;
             columnIndex < 5;
             columnIndex++) {

            String value =
                    getCellValue(
                            row,
                            columnIndex,
                            formatter);

            if (!value.isEmpty()) {
                return false;
            }
        }

        return true;
    }
}