package com.cdac.ecommerce.dto.request;

public record CustomerProfileRequestDTO (
//        @NotBlank(message = "Full name is required")
        String fullName,

//        @NotBlank(message = "Phone number is required")
        String phone){
}
