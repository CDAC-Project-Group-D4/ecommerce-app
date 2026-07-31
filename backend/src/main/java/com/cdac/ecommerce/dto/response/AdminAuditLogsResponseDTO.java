package com.cdac.ecommerce.dto.response;

import java.time.LocalDateTime;

public record AdminAuditLogsResponseDTO(
        Long id,
        Long adminId,
        String adminEmail,
        String action,
        String entityName,
        Long entityId,
        String details,
        LocalDateTime createdAt
) {
}
