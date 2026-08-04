package com.cdac.ecommerce.dto.response;

import java.time.LocalDateTime;

public record SellerResponseDTO(

        long sellerId,
        String name,
        String email,
        String phone,
        String imageUrl,
        boolean blocked,
        boolean active,
        LocalDateTime createdAt

) {
}
