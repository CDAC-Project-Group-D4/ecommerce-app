package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.SellerCommissionOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerCommissionOverrideRepository extends JpaRepository<SellerCommissionOverride, Long> {

    Optional<SellerCommissionOverride> findBySeller_Id(Long id);
}
