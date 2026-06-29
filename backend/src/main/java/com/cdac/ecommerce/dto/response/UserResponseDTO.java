package com.cdac.ecommerce.dto.response;

import java.math.BigInteger;
import java.time.LocalDateTime;

public record UserResponseDTO(

        Long userId,
        String fullName,
        String email,
        String phone,
        String role,
        boolean active,
        LocalDateTime createdAt

) {
}
