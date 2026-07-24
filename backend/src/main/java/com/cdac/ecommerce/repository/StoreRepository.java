package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Long> {
}
