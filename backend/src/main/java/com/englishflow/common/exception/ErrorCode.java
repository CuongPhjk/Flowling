package com.englishflow.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "Email already registered"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid email or password"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized access"),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "Access is denied"),
    CONTENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Content not found"),
    VOCABULARY_NOT_FOUND(HttpStatus.NOT_FOUND, "Vocabulary not found"),
    USER_VOCABULARY_NOT_FOUND(HttpStatus.NOT_FOUND, "User vocabulary entry not found"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Invalid request payload"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");

    private final HttpStatus httpStatus;
    private final String defaultMessage;

    ErrorCode(HttpStatus httpStatus, String defaultMessage) {
        this.httpStatus = httpStatus;
        this.defaultMessage = defaultMessage;
    }
}
