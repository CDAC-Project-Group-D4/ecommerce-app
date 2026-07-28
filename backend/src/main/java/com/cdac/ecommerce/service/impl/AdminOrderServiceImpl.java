package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.PaymentMethod;
import com.cdac.ecommerce.exception.OrderNotFoundException;
import com.cdac.ecommerce.mapper.OrderMapper;
import com.cdac.ecommerce.repository.OrderRepository;
import com.cdac.ecommerce.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    public List<OrderResponseDTO> getAllOrders() {

        List<OrderResponseDTO> orderResponseDTOS = orderRepository
                .findAll()
                .stream()
                .map(order -> orderMapper.toOrderResponseDTO(order))
                .toList();

        return orderResponseDTOS;

    }

    @Override
    @Transactional
    public boolean simulateOutForDelivery(Long id) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if(order.getOrderStatus().equals(OrderStatus.SHIPPED)){
            order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);
            return true;
        }

        return false;
    }

    @Override
    @Transactional
    public boolean simulateDelivered(Long id) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if(order.getOrderStatus().equals(OrderStatus.OUT_FOR_DELIVERY)){
            order.setOrderStatus(OrderStatus.DELIVERED);
            order.setDeliveredAt(LocalDateTime.now());
            return true;
        }

        return false;
    }
}
