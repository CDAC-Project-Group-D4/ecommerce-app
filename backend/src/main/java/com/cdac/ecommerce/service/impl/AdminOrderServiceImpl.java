package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.PaymentMethod;
import com.cdac.ecommerce.exception.OrderNotFoundException;
import com.cdac.ecommerce.mapper.OrderMapper;
import com.cdac.ecommerce.repository.OrderRepository;
import com.cdac.ecommerce.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
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
    @PreAuthorize("hasRole('ADMIN')")
    @LogAdminAction(
            action = Action.UPDATE,
            entity = EntityEnum.ORDER,
            entityId = "#id",
            description = "Order marked out for delivery"
    )
    public boolean simulateOutForDelivery(Long id) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if (order.getOrderStatus() == OrderStatus.SHIPPED) {
            order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);

            order.getOrderItems().forEach(item -> {
                if (item.getItemStatus() == OrderStatus.SHIPPED) {
                    item.setItemStatus(OrderStatus.OUT_FOR_DELIVERY);
                }
            });

            orderRepository.save(order);
            return true;
        }

        return false;
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @LogAdminAction(
            action = Action.UPDATE,
            entity = EntityEnum.ORDER,
            entityId = "#id",
            description = "Order marked delivered."
    )
    public boolean simulateDelivered(Long id) {

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if (order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            LocalDateTime deliveredAt = LocalDateTime.now();

            order.setOrderStatus(OrderStatus.DELIVERED);
            order.setDeliveredAt(deliveredAt);

            order.getOrderItems().forEach(item -> {
                if (item.getItemStatus() == OrderStatus.OUT_FOR_DELIVERY) {
                    item.setItemStatus(OrderStatus.DELIVERED);
                    item.setDeliveredAt(deliveredAt);
                }
            });

            orderRepository.save(order);
            return true;
        }

        return false;
    }
}
