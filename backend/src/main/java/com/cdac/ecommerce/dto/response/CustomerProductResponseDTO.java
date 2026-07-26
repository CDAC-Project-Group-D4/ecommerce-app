package com.cdac.ecommerce.dto.response;

import java.math.BigDecimal;

public record CustomerProductResponseDTO(
        Long productId,
        Long storeId,
        Long categoryId,
        String name,
        BigDecimal price

) {

}
