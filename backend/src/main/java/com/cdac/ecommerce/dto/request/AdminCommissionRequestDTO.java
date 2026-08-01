package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AdminCommissionRequestDTO(

        @NotNull(message = "Commission percentage is required")
        @DecimalMin(value = "0.0", message = "Percentage cannot be negative")
        @DecimalMax(value = "100.0", message = "Percentage cannot be more than 100")
        BigDecimal percentage
) {
}
