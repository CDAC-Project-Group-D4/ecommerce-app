package com.cdac.ecommerce.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SignInResponseDTO {

    private Long userId;
    private String fullName;
    private String email;
    private String imageUrl;
    private String phone;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;
    private String message;

    private String jwtToken;
    private String tokenType = "Bearer";
}