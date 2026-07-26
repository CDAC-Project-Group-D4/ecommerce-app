package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.CartRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * userId now comes from the authenticated JWT principal, not the URL —
 * removes the earlier security gap where any caller could pass any userId.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

	private final CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	// POST /api/cart — add to cart (bumps quantity if already present)
	@PostMapping
	public ResponseEntity<CartResponseDTO> addToCart(
			@AuthenticationPrincipal UserDetailsImpl userDetails,
			@Valid @RequestBody CartRequestDTO requestDTO) {
		CartResponseDTO response = cartService.addToCart(userDetails.getId(), requestDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	// GET /api/cart — list cart items
	@GetMapping
	public ResponseEntity<List<CartResponseDTO>> getCart(
			@AuthenticationPrincipal UserDetailsImpl userDetails) {
		return ResponseEntity.ok(cartService.getCartForUser(userDetails.getId()));
	}

	// PATCH /api/cart/{cartItemId} — update quantity
	@PatchMapping("/{cartItemId}")
	public ResponseEntity<CartResponseDTO> updateQuantity(
			@AuthenticationPrincipal UserDetailsImpl userDetails,
			@PathVariable Long cartItemId,
			@RequestParam Integer quantity) {
		CartResponseDTO response = cartService.updateQuantity(userDetails.getId(), cartItemId, quantity);
		return ResponseEntity.ok(response);
	}

	// DELETE /api/cart/{cartItemId} — remove one item
	@DeleteMapping("/{cartItemId}")
	public ResponseEntity<Void> removeItem(
			@AuthenticationPrincipal UserDetailsImpl userDetails,
			@PathVariable Long cartItemId) {
		cartService.removeItem(userDetails.getId(), cartItemId);
		return ResponseEntity.noContent().build();
	}

	// DELETE /api/cart — clear entire cart
	@DeleteMapping
	public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
		cartService.clearCart(userDetails.getId());
		return ResponseEntity.noContent().build();
	}
}