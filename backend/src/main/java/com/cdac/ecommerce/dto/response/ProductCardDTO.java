package com.cdac.ecommerce.dto.response;

import java.math.BigDecimal;

public record ProductCardDTO(
        Long id,

        String name,
        String description,
        BigDecimal price,

        String imageUrl,

//        Double avgRating,

        String storeName
) {

}
