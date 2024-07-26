package com.example.bank_app.exceptionhandling;

public class InvalidTransactionIndicatorException extends RuntimeException {
    public InvalidTransactionIndicatorException(String message) {
        super(message);
    }
}
