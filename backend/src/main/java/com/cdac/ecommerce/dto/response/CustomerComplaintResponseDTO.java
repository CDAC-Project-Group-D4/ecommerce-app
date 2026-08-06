package com.cdac.ecommerce.dto.response;

import java.time.LocalDateTime;

public record CustomerComplaintResponseDTO(
        Long complaintId,
        Long orderId,
        Long customerId,
        Long resolvedBy,
        String customerName,
        String body,
        String subject,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime resolvedAt,
        Boolean isActive
) {
}
