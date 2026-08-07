package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.NotificationRequestDTO;
import com.cdac.ecommerce.dto.response.NotificationResponseDTO;
import com.cdac.ecommerce.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/store/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Get all notifications for seller store in descending order
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getSellerNotifications() {
        return ResponseEntity.ok(notificationService.getSellerNotifications());
    }

    // Manual notification creation via NotificationRequestDTO
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(@Valid @RequestBody NotificationRequestDTO requestDTO) {
        return ResponseEntity.ok(notificationService.createNotification(requestDTO));
    }

    // Mark single notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
