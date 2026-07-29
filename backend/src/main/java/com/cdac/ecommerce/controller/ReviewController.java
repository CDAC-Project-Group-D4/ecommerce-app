package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.ReviewRequestDTO;
import com.cdac.ecommerce.dto.response.ReviewResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Add Review
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> addReview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ReviewRequestDTO requestDTO) {

        ReviewResponseDTO response = reviewService.addReview(
                userDetails.getId(),
                requestDTO
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Update Review
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequestDTO requestDTO) {

        ReviewResponseDTO response = reviewService.updateReview(
                userDetails.getId(),
                reviewId,
                requestDTO
        );

        return ResponseEntity.ok(response);
    }

    // Delete Review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long reviewId) {

        reviewService.deleteReview(
                userDetails.getId(),
                reviewId
        );

        return ResponseEntity.ok("Review deleted successfully.");
    }

    // My Reviews
    @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(
                reviewService.getMyReviews(userDetails.getId())
        );
    }
}