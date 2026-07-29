package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.ReviewRequestDTO;
import com.cdac.ecommerce.dto.response.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {

    // Add a new review
    ReviewResponseDTO addReview(Long userId, ReviewRequestDTO requestDTO);

    // Update an existing review
    ReviewResponseDTO updateReview(Long userId, Long reviewId, ReviewRequestDTO requestDTO);

    // Delete (Soft Delete) a review
    void deleteReview(Long userId, Long reviewId);

    // Get all reviews of a product
    List<ReviewResponseDTO> getReviewsByProduct(Long productId);

    // Get all reviews given by the logged-in user
    List<ReviewResponseDTO> getMyReviews(Long userId);
}