package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.NotificationRequestDTO;
import com.cdac.ecommerce.dto.response.NotificationResponseDTO;
import com.cdac.ecommerce.entity.Product;

import java.util.List;

public interface NotificationService {

    // Trigger low-stock check for a product
    void checkAndTriggerLowStockNotification(Product product);

    // Manual notification creation via DTO
    NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO);

    // Get all notifications for logged in seller (newest first)
    List<NotificationResponseDTO> getSellerNotifications();

    // Mark notification as read
    NotificationResponseDTO markAsRead(Long notificationId);

    // Mark all seller notifications as read
    void markAllAsRead();
}
