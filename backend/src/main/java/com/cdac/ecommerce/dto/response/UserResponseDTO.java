package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.Roles;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponseDTO(

        Long userId,
        String fullName,
        String email,
        String imageUrl,
        String phone,
        Roles role,
        boolean active,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt
) {
}
