package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.ReviewRequestDTO;
import com.cdac.ecommerce.dto.response.ReviewResponseDTO;
import com.cdac.ecommerce.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    // Entity -> Response DTO
    public ReviewResponseDTO toReviewResponseDTO(Review review) {

        ReviewResponseDTO dto = new ReviewResponseDTO();

        dto.setReviewId(review.getId());

        dto.setProductId(review.getProduct().getId());

        dto.setProductName(review.getProduct().getName());

        dto.setProductImage(review.getProduct().getImageUrl());

        dto.setOrderId(review.getOrder().getId());

        dto.setRating(review.getRating());

        dto.setComment(review.getComment());

        dto.setCustomerName(review.getUser().getFullName());

        dto.setCreatedAt(review.getCreatedAt());

        return dto;
    }

    // Request DTO -> Entity
    public Review toReviewEntity(ReviewRequestDTO dto) {

        Review review = new Review();

        review.setRating(dto.getRating());

        review.setComment(dto.getComment());

        return review;
    }
}
