package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequestDTO {

    @Positive(message = "price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "stock cannot be negative")
    private Integer stock;

}
