package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SellerPayoutResponseDTO(
        Long id,
        Long sellerId,
        String sellerName,
        String sellerEmail,
        BigDecimal amount,
        PaymentStatus status,
        LocalDateTime processedAt,
        LocalDateTime createdAt
) {
}
