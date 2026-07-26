package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrderResponseDTO {

    private Long orderId;

    private OrderStatus orderStatus;

    private PaymentMethod paymentMethod;

    private BigDecimal totalAmt;

    private String paymentRef;

    private String trackingId;

    private CustomerAddressResponseDTO address;

    private List<OrderItemResponseDTO> orderItems;

    private LocalDateTime placedAt;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime completedAt;
}