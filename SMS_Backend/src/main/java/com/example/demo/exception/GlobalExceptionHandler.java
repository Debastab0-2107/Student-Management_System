package com.example.demo.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Provides centralized exception handling for REST controllers.
 *
 * This class catches application-specific exceptions and converts
 * them into consistent HTTP responses so that individual controllers
 * do not need to contain repetitive exception-handling code.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles OCR microservice related failures.
     *
     * @param exception OCR service exception raised by the application
     * @return HTTP 502 response containing the error message
     */
    @ExceptionHandler(OcrServiceException.class)
    public ResponseEntity<Map<String, Object>> handleOcrServiceException(
            OcrServiceException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.BAD_GATEWAY.value());
        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(response);
    }

    /**
     * Handles invalid or unsupported uploaded files.
     *
     * @param exception file validation exception raised by the application
     * @return HTTP 400 response containing the validation error message
     */
    @ExceptionHandler(FileValidationException.class)
    public ResponseEntity<Map<String, Object>> handleFileValidationException(
            FileValidationException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("message", exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * Handles unexpected runtime exceptions that are not explicitly
     * handled by the application-specific exception handlers.
     *
     * @param exception unexpected runtime exception
     * @return HTTP 500 response containing a generic error message
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("message", "An unexpected server error occurred.");

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}