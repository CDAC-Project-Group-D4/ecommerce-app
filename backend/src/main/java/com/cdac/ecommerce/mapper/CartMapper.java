package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.entity.Cart;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CartMapper {

    /**
     * Cart entity -> CartResponseDTO
     * Pulls live product name/price/image/stock (not snapshotted — cart should
     * always reflect current pricing/availability, unlike order_items).
     */
    public CartResponseDTO toResponseDTO(Cart cart) {
        if (cart == null) {
            return null;
        }

        BigDecimal price = cart.getProduct().getPrice();
        Integer quantity = cart.getQuantity();
        BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(quantity));

        return CartResponseDTO.builder()
                .id(cart.getId())
                .productId(cart.getProduct().getId())
                .productName(cart.getProduct().getName())
                .productImageUrl(resolvePrimaryImageUrl(cart))
                .price(price)
                .inStock(cart.getProduct().getStock() > 0) // stock is primitive int, can't be null
                .quantity(quantity)
                .lineTotal(lineTotal)
                .addedAt(cart.getAddedAt())
                .build();
    }

   
    private String resolvePrimaryImageUrl(Cart cart) {
        return null;
    }
}