package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.enums.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ReturnRequestRepo extends JpaRepository<ReturnRequest, Long> {

    //admin
    @Query("SELECT rq FROM ReturnRequest rq WHERE rq.sellerDecision = :decision AND rq.adminDecision IS NULL AND rq.active = true")
    List<ReturnRequest> findDisputedReturnRequests(@Param(value = "decision") Decision decision);

    //Customer
    // My Returns
    List<ReturnRequest> findByUser_IdOrderByCreatedAtDesc(Long userId);

    // Return Details
    Optional<ReturnRequest> findByIdAndUser_Id(Long returnRequestId, Long userId);

    // Prevent duplicate return request
    boolean existsByOrder_IdAndOrderItem_Id(Long orderId, Long orderItemId);

    // Returns of an order
    List<ReturnRequest> findByOrder_Id(Long orderId);

    List<ReturnRequest> findByOrderItem_Product_Store_User_IdOrderByCreatedAtDesc(Long sellerId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ReturnRequest rr WHERE rr.orderItem.id IN (SELECT oi.id FROM OrderItem oi WHERE oi.product.id IN :productIds)")
    void deleteByProduct_IdIn(@Param("productIds") List<Long> productIds);
}
