package com.cdac.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserAlreadyExistsException extends ResourceNotFoundException {
    public UserAlreadyExistsException(String s) {
        super(s);
    }
}
