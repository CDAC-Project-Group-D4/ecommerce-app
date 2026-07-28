package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.enums.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReturnRequestRepo extends JpaRepository<ReturnRequest, Long> {

    @Query("SELECT rq FROM ReturnRequest rq WHERE rq.sellerDecision = :decision AND rq.adminDecision IS NULL AND rq.active = true")
    List<ReturnRequest> findDisputedReturnRequests(@Param(value = "decision") Decision decision);
}
