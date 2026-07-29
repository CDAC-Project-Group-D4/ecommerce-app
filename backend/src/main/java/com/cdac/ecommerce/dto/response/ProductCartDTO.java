package com.cdac.ecommerce.dto.response;

import java.math.BigDecimal;

public record ProductCartDTO(Long id,
                             String name,
                             BigDecimal price,
//                             String thumbnailUrl,
                             String storeName) {
}
