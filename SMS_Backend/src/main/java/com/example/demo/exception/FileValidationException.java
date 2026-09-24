package com.example.demo.exception;

/**
 * Custom runtime exception used when an uploaded file fails
 * application-level validation.
 *
 * This exception will primarily be used by the OCR-related
 * file processing flow for invalid file type, missing file,
 * unsupported format, or other file validation failures.
 */
public class FileValidationException extends RuntimeException {

    /**
     * Creates a file validation exception with the specified message.
     *
     * @param message description of the file validation failure
     */
    public FileValidationException(String message) {
        super(message);
    }

    /**
     * Creates a file validation exception with a message and
     * the original exception that caused the validation failure.
     *
     * @param message description of the file validation failure
     * @param cause original exception that caused the failure
     */
    public FileValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}