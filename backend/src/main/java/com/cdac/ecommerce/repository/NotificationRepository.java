package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fetch all notifications for a store sorted by newest first (descending)
    List<Notification> findByStore_IdOrderByCreatedAtDesc(Long storeId);

    // Check if an unread low-stock notification already exists for this product
    Optional<Notification> findFirstByStore_IdAndProduct_IdAndReadFalseOrderByCreatedAtDesc(Long storeId, Long productId);
}
