package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.SellerPayout;
import com.cdac.ecommerce.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerPayoutRepository extends JpaRepository<SellerPayout, Long> {
    Page<SellerPayout> findByStatus(PaymentStatus status, Pageable pageable);

    Optional<SellerPayout> findBySeller_IdAndStatus(Long id, PaymentStatus status);
}
