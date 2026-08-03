package com.cdac.ecommerce.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record ReturnRequestResponseDTO(
        Long id,
        Long orderId,
        Long orderItemId,
        Long storeId,
        String requestType,
        String sellerDecision,
        String adminDecision,
        List<ReturnRequestImageResponseDTO> images,
        LocalDateTime createdAt
) {
}
