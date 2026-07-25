package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;


public interface StoreRepository extends JpaRepository<Store, Long> {
    @Modifying
    @Transactional
    void deleteByUser(User user);
}
