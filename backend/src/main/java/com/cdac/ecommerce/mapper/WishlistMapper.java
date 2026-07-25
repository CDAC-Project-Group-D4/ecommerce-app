package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.WishlistResponseDTO;
import com.cdac.ecommerce.entity.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    public WishlistResponseDTO toResponseDTO(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }

        return WishlistResponseDTO.builder()
                .id(wishlist.getId())
                .productId(wishlist.getProduct().getId())
                .productName(wishlist.getProduct().getName())
                .productImageUrl(null) // same placeholder as CartMapper — wire up once ProductImage relation is available
                .price(wishlist.getProduct().getPrice())
                .inStock(wishlist.getProduct().getStock() > 0)
                .addedAt(wishlist.getCreatedAt())
                .build();
    }
}