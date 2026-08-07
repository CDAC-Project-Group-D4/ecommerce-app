package com.cdac.ecommerce.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record ProductCardDTO(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        String storeName,
        List<ProductAttributeDTO> attributes
) {

}
