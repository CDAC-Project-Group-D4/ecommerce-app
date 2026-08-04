package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Get all products of an order
    List<OrderItem> findByOrder_Id(Long orderId);

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderItem oi WHERE oi.product.id IN :productIds")
    void deleteByProduct_IdIn(@Param("productIds") List<Long> productIds);
}