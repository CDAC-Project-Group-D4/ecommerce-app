package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.OrderResponseDTO;

import java.util.List;

public interface AdminOrderService {
    List<OrderResponseDTO> getAllOrders();

    boolean simulateOutForDelivery(Long id);

    boolean simulateDelivered(Long id);
}
