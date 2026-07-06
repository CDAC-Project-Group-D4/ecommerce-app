package com.cdac.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class OrderNotFoundException extends ResourceNotFoundException {
    public OrderNotFoundException(String s) {
        super(s);
    }
}
