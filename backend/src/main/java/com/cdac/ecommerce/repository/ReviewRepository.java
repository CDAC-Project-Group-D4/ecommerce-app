package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get all active reviews of a product
    List<Review> findByProduct_IdAndActiveTrue(Long productId);

    // Get all reviews given by a user
    List<Review> findByUser_Id(Long userId);

    // Get one review of a user
    Optional<Review> findByIdAndUser_Id(Long reviewId, Long userId);

    // Check if user already reviewed this product in this order
    boolean existsByUser_IdAndProduct_IdAndOrder_Id(
            Long userId,
            Long productId,
            Long orderId
    );


    //Edit Review
    Optional<Review> findByUser_IdAndProduct_IdAndOrder_Id(
            Long userId,
            Long productId,
            Long orderId
    );
}
