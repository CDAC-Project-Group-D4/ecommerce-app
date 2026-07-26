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
public class WishlistResponseDTO {

    private Long id;              // wishlists.id — needed for remove/move-to-cart calls
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal price;
    private Boolean inStock;

    private LocalDateTime addedAt;
}