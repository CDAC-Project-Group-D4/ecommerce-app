package com.cdac.ecommerce.dto.response;

import java.math.BigDecimal;

public record ProductCardDTO(
        Long id,

        String name,

        BigDecimal price,

//        String thumbnailUrl,

//        Double avgRating,

        String storeName
) {

}
