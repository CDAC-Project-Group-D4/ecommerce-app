package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.Category;
import com.cdac.ecommerce.entity.Store;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private int low_stock_threshold;
    private boolean is_active=true;
    private String imageUrl = null;
    private Long storeId;
    private Long categoryId;
    private String message;
}

