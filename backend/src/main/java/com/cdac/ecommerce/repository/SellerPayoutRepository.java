package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.SellerPayout;
import com.cdac.ecommerce.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerPayoutRepository extends JpaRepository<SellerPayout, Long> {
    @Override
    @EntityGraph(attributePaths = {"seller"})
    Page<SellerPayout> findAll(Pageable pageable);

    // Fetch payouts by status with seller details eagerly loaded
    @EntityGraph(attributePaths = {"seller"})
    Page<SellerPayout> findByStatus(PaymentStatus status, Pageable pageable);

    // Fetch a single payout by seller ID and status with explicit join fetch
    @Query("SELECT p FROM SellerPayout p LEFT JOIN FETCH p.seller WHERE p.seller.id = :sellerId AND p.status = :status")
    Optional<SellerPayout> findBySeller_IdAndStatus(@Param("sellerId") Long sellerId, @Param("status") PaymentStatus status);
}
