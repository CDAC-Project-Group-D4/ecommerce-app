package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    //get all oreders of a user
    List<Order> findByUser_Id(Long userId);

    // Get one order of a specific user
    Optional<Order> findByIdAndUser_Id(Long orderId,Long userId);

    // Get orders by status (Admin)
    List<Order> findByOrderStatus(OrderStatus orderStatus);

    // Latest orders first
    List<Order> findByUser_IdOrderByPlacedAtDesc(Long userId);

    // Get all orders containing products belonging to a seller's store
    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderItems item WHERE item.product.store.id = :storeId ORDER BY o.placedAt DESC")
    List<Order> findOrdersByStoreId(@Param("storeId") Long storeId);
}