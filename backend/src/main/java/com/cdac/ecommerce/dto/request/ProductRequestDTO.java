package com.cdac.ecommerce.dto.request;

import com.cdac.ecommerce.entity.Category;
import com.cdac.ecommerce.entity.Store;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {

    @NotBlank(message = "product name is required")
    private String name;

    @NotNull(message = "price is required")
    @Positive(message = "price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "stock cannot be negative")
    private int stock;

    @Min(value = 0, message = "low stock threshold cannot be negative")
    private int low_stock_threshold;

    @NotNull(message = "category id is required")
    private Long category_id;

    private String imageUrl;
}
