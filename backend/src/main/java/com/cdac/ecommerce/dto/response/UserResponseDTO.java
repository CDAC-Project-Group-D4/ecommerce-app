package com.cdac.ecommerce.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponseDTO(

        Long userId,
        String fullName,
        String email,
        String imageUrl,
        String phone,
        Set<String> roles,
        boolean active,
        LocalDateTime createdAt

) {
}
