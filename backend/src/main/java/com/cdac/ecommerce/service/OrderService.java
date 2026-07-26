package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.PlaceOrderRequestDTO;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;

import java.util.List;

public interface OrderService {

    OrderResponseDTO placeOrder(Long userId, PlaceOrderRequestDTO request);

    List<OrderResponseDTO> getMyOrders(Long userId);

    OrderResponseDTO getOrderById(Long userId, Long orderId);

    void cancelOrder(Long userId, Long orderId);
}