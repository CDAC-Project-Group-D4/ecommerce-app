package com.cdac.ecommerce.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiErrorResponse(
        int status,
        String message,
        LocalDateTime timeStamp,
        Map<String, String> errors
) {

    public ApiErrorResponse(int status, String message){
        this(status, message, LocalDateTime.now(), null);
    }
}
