package com.cdac.ecommerce.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResponseDTO {

    private Long reviewId;

    private Long productId;

    private String productName;

    private String productImage;

    private Long orderId;

    private Integer rating;

    private String comment;

    private String customerName;

    private LocalDateTime createdAt;
}