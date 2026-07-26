package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.WishlistRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.dto.response.WishlistResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // POST /api/wishlist — add to wishlist
    @PostMapping
    public ResponseEntity<WishlistResponseDTO> addToWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody WishlistRequestDTO requestDTO) {
        WishlistResponseDTO response = wishlistService.addToWishlist(userDetails.getId(), requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/wishlist — list wishlist items
    @GetMapping
    public ResponseEntity<List<WishlistResponseDTO>> getWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(wishlistService.getWishlistForUser(userDetails.getId()));
    }

    // DELETE /api/wishlist/{wishlistItemId} — remove one item
    @DeleteMapping("/{wishlistItemId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long wishlistItemId) {
        wishlistService.removeFromWishlist(userDetails.getId(), wishlistItemId);
        return ResponseEntity.noContent().build();
    }

    // POST /api/wishlist/{wishlistItemId}/move-to-cart
    @PostMapping("/{wishlistItemId}/move-to-cart")
    public ResponseEntity<CartResponseDTO> moveToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long wishlistItemId) {
        CartResponseDTO response = wishlistService.moveToCart(userDetails.getId(), wishlistItemId);
        return ResponseEntity.ok(response);
    }
}