package com.cdac.ecommerce.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ReturnRequestImageResponseDTO(

        Long id,
        String imageUrl,
        LocalDateTime createdAt
) {
}
