package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.NotificationRequestDTO;
import com.cdac.ecommerce.dto.response.NotificationResponseDTO;
import com.cdac.ecommerce.entity.Notification;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.repository.NotificationRepository;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ProductRepository productRepository;
    private final UserRepo userRepository;

    @Override
    @Transactional
    public void checkAndTriggerLowStockNotification(Product product) {
        if (product == null || product.getStore() == null) {
            return;
        }

        int currentStock = product.getStock();
        int threshold = product.getLowStockThreshold();

        if (currentStock <= threshold) {
            String message = String.format(
                    "Stock more items of %s. Current stock: %d (Threshold: %d)",
                    product.getName(),
                    currentStock,
                    threshold
            );

            // Check if there is already an unread notification for this product
            Optional<Notification> existingNotification = notificationRepository
                    .findFirstByStore_IdAndProduct_IdAndReadFalseOrderByCreatedAtDesc(
                            product.getStore().getId(),
                            product.getId()
                    );

            if (existingNotification.isPresent()) {
                // Update message with latest stock level
                Notification notification = existingNotification.get();
                notification.setMessage(message);
                notificationRepository.save(notification);
                log.info("Updated low stock notification for product ID {}", product.getId());
            } else {
                // Create new notification
                Notification newNotification = new Notification();
                newNotification.setProduct(product);
                newNotification.setStore(product.getStore());
                newNotification.setMessage(message);
                newNotification.setRead(false);
                notificationRepository.save(newNotification);
                log.info("Created new low stock notification for product ID {}", product.getId());
            }
        }
    }

    @Override
    @Transactional
    public NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO) {
        User user = getAuthenticatedUser();
        Store store = user.getStore();
        if (store == null) {
            throw new ResourceNotFoundException("Store not found for logged in user");
        }

        Product product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String message = requestDTO.getMessage();
        if (message == null || message.isBlank()) {
            message = String.format(
                    "Stock more items of %s. Current stock: %d (Threshold: %d)",
                    product.getName(),
                    product.getStock(),
                    product.getLowStockThreshold()
            );
        }

        Notification notification = new Notification();
        notification.setStore(store);
        notification.setProduct(product);
        notification.setMessage(message);
        notification.setRead(requestDTO.getRead() != null ? requestDTO.getRead() : false);

        Notification saved = notificationRepository.save(notification);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public List<NotificationResponseDTO> getSellerNotifications() {
        User user = getAuthenticatedUser();
        Store store = user.getStore();
        if (store == null) {
            return Collections.emptyList();
        }

        // Auto-scan store products to generate any missing low stock notifications
        List<Product> products = productRepository.findByStore_Id(store.getId());
        for (Product product : products) {
            checkAndTriggerLowStockNotification(product);
        }

        List<Notification> notifications = notificationRepository.findByStore_IdOrderByCreatedAtDesc(store.getId());
        return notifications.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationResponseDTO markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        User user = getAuthenticatedUser();
        if (user.getStore() == null || !notification.getStore().getId().equals(user.getStore().getId())) {
            throw new IllegalStateException("Unauthorized access to notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        User user = getAuthenticatedUser();
        Store store = user.getStore();
        if (store == null) {
            return;
        }

        List<Notification> notifications = notificationRepository.findByStore_IdOrderByCreatedAtDesc(store.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new UserNotFoundException("User is not authenticated");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private NotificationResponseDTO mapToDTO(Notification notification) {
        Product p = notification.getProduct();
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .productId(p != null ? p.getId() : null)
                .productName(p != null ? p.getName() : null)
                .productImage(p != null ? p.getImageUrl() : null)
                .currentStock(p != null ? p.getStock() : 0)
                .lowStockThreshold(p != null ? p.getLowStockThreshold() : 0)
                .build();
    }
}
