package com.cdac.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {

    private Long id;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    private Long productId;
    private String productName;
    private String productImage;
    private Integer currentStock;
    private Integer lowStockThreshold;
}
