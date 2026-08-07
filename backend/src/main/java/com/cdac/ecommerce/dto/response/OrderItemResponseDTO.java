package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderItemResponseDTO {

    private Long orderItemId;

    private Long productId;

    private String productName;

    private String productImage;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal lineTotal;

    private OrderStatus itemStatus;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;
}
