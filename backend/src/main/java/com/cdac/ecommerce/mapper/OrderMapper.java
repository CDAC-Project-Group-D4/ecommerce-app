package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.OrderItemResponseDTO;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.OrderItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final CustomerAddressMapper addressMapper;

    public OrderMapper(CustomerAddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public OrderItemResponseDTO toOrderItemResponseDTO(OrderItem orderItem) {

        OrderItemResponseDTO dto = new OrderItemResponseDTO();

        dto.setOrderItemId(orderItem.getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setProductName(orderItem.getProduct().getName());
        dto.setProductImage(orderItem.getProduct().getImageUrl());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setLineTotal(orderItem.getLineTotal());
        dto.setItemStatus(orderItem.getItemStatus());
        dto.setShippedAt(orderItem.getShippedAt());
        dto.setDeliveredAt(orderItem.getDeliveredAt());

        return dto;
    }

    public OrderResponseDTO toOrderResponseDTO(Order order) {

        OrderResponseDTO dto = new OrderResponseDTO();

        dto.setOrderId(order.getId());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotalAmt(order.getTotalAmt());
        dto.setPaymentRef(order.getPaymentRef());
        dto.setTrackingId(order.getTrackingId());

        dto.setPlacedAt(order.getPlacedAt());
        dto.setShippedAt(order.getShippedAt());
        dto.setDeliveredAt(order.getDeliveredAt());
        dto.setCompletedAt(order.getCompletedAt());

        dto.setAddress(addressMapper.toResponseDto(order.getAddress()));

        List<OrderItemResponseDTO> items = new ArrayList<>();

        for (OrderItem item : order.getOrderItems()) {

            items.add(toOrderItemResponseDTO(item));
        }

        dto.setOrderItems(items);

        return dto;
    }
}
