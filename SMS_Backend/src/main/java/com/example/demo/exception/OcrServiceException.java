package com.example.demo.exception;

/**
 * Custom runtime exception used when communication with the OCR
 * microservice fails or when the OCR service returns an invalid
 * or unusable response.
 *
 * This exception allows the service layer and global exception
 * handler to distinguish OCR-related failures from other
 * application errors.
 */
public class OcrServiceException extends RuntimeException {

    /**
     * Creates an OCR service exception with the specified message.
     *
     * @param message description of the OCR service failure
     */
    public OcrServiceException(String message) {
        super(message);
    }

    /**
     * Creates an OCR service exception with a message and the
     * original exception that caused the failure.
     *
     * @param message description of the OCR service failure
     * @param cause original exception that caused the failure
     */
    public OcrServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}