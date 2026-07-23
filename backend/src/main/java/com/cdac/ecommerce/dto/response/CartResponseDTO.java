package com.cdac.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDTO {

    private Long id;              // cart_items.id — needed for update/remove calls
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal price;     
    private Boolean inStock;     
    
    private Integer quantity;
    private BigDecimal lineTotal; // price * quantity, computed by the mapper/service

    private LocalDateTime addedAt;
}