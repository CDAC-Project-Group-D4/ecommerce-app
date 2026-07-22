package com.cdac.ecommerce.dto.response;

import java.time.LocalDateTime;

public record CustomerResponseDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String imageUrl,
        String role,
        boolean blocked,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
