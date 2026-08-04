package com.cdac.ecommerce.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PlatformSettingResponseDTO(
        Long id,
        BigDecimal commissionPercentage,
        Long updatedByUserId,
        String updatedByName,
        LocalDateTime updatedAt
) {
}
