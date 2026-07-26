package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Get all products of an order
    List<OrderItem> findByOrder_Id(Long orderId);

}