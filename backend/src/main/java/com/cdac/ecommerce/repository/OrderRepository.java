package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    //get all oreders of a user
    List<Order> findByUser_Id(Long userId);

    // Get one order of a specific user
    Optional<Order> findByIdAndUser_Id(Long orderId,Long userId);

    // Get orders by status (Admin)
    List<Order> findByOrderStatus(OrderStatus orderStatus);

    // Latest orders first
    List<Order> findByUser_IdOrderByPlacedAtDesc(Long userId);

}