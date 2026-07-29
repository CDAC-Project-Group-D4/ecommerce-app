package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ReviewRequestDTO;
import com.cdac.ecommerce.dto.response.ReviewResponseDTO;
import com.cdac.ecommerce.entity.*;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.exception.ResourceAlreadyExistsException;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.mapper.ReviewMapper;
import com.cdac.ecommerce.repository.*;
import com.cdac.ecommerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepo userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public ReviewResponseDTO addReview(Long userId,
                                       ReviewRequestDTO requestDTO) {

        // Fetch User
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Fetch Product
        Product product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        // Fetch Order
        Order order = orderRepository
                .findByIdAndUser_Id(requestDTO.getOrderId(), userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        boolean productExists = order.getOrderItems()
                .stream()
                .anyMatch(item ->
                        item.getProduct().getId().equals(requestDTO.getProductId()));

        if (!productExists) {
            throw new ResourceNotFoundException("This product does not belong to the selected order.");
        }

        // Check Order Status
        if (order.getOrderStatus() != OrderStatus.DELIVERED &&
                order.getOrderStatus() != OrderStatus.COMPLETED) {

            throw new IllegalStateException(
                    "Review can only be added after delivery.");
        }

        // Check Duplicate Review
        if (reviewRepository.existsByUser_IdAndProduct_IdAndOrder_Id(
                userId,
                requestDTO.getProductId(),
                requestDTO.getOrderId())) {

            throw new ResourceAlreadyExistsException("You have already submitted a review for this product.");
        }

        // Create Review
        Review review = reviewMapper.toReviewEntity(requestDTO);

        review.setUser(user);
        review.setProduct(product);
        review.setOrder(order);

        reviewRepository.save(review);

        return reviewMapper.toReviewResponseDTO(review);
    }

    @Override
    public ReviewResponseDTO updateReview(Long userId,
                                          Long reviewId,
                                          ReviewRequestDTO requestDTO) {

        Review review = reviewRepository
                .findByIdAndUser_Id(reviewId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Review not found."));

        review.setRating(requestDTO.getRating());
        review.setComment(requestDTO.getComment());

        reviewRepository.save(review);

        return reviewMapper.toReviewResponseDTO(review);
    }

    @Override
    public void deleteReview(Long userId,
                             Long reviewId) {

        Review review = reviewRepository
                .findByIdAndUser_Id(reviewId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Review not found."));

        review.setActive(false);

        reviewRepository.save(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getReviewsByProduct(Long productId) {

        List<Review> reviews =
                reviewRepository.findByProduct_IdAndActiveTrue(productId);

        return reviews.stream()
                .map(reviewMapper::toReviewResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> getMyReviews(Long userId) {

        List<Review> reviews = reviewRepository.findByUser_Id(userId);

        return reviews.stream()
                .filter(Review::getActive)
                .map(reviewMapper::toReviewResponseDTO)
                .toList();
    }

}
