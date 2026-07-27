package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.Roles;
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
        LocalDateTime createdAt
) {
}
