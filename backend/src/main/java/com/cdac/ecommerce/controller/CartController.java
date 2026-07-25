package com.cdac.ecommerce.controller;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.ecommerce.dto.request.CartRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.service.CartService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users/{userId}/cart")
public class CartController {
	
	 private final CartService cartService;
	 
	    public CartController(CartService cartService) {
	        this.cartService = cartService;
	    }
	 
	    // POST /api/users/{userId}/cart  — add to cart (bumps quantity if already present)
	    
	    @PostMapping
	    public ResponseEntity<CartResponseDTO> addToCart( @PathVariable Long userId,
	            @Valid @RequestBody CartRequestDTO requestDTO) {
	    	
	        CartResponseDTO response = cartService.addToCart(userId, requestDTO);
	        return ResponseEntity.status(HttpStatus.CREATED).body(response);
	    }

	    
	    // GET /api/users/{userId}/cart  — list cart items
	    @GetMapping
	    public ResponseEntity<List<CartResponseDTO>> getCart(@PathVariable Long userId) {
	        return ResponseEntity.ok(cartService.getCartForUser(userId));
	    }
	    
	    // PATCH /api/users/{userId}/cart/{cartItemId}  — update quantity
	    @PatchMapping("/{cartItemId}")
	    public ResponseEntity<CartResponseDTO> updateQuantity(
	            @PathVariable Long userId,
	            @PathVariable Long cartItemId,
	            @RequestParam Integer quantity) {
	        CartResponseDTO response = cartService.updateQuantity(userId, cartItemId, quantity);
			if (response == null) {
				return ResponseEntity.noContent().build(); // HTTP 204
			}
	        return ResponseEntity.ok(response);
	    }
	    
	    // DELETE /api/users/{userId}/cart/{cartItemId}  — remove one item
	    @DeleteMapping("/{cartItemId}")
	    public ResponseEntity<Void> removeItem(
	            @PathVariable Long userId,
	            @PathVariable Long cartItemId) {
	        cartService.removeItem(userId, cartItemId);
	        return ResponseEntity.noContent().build();
	    }
	    
	    // DELETE /api/users/{userId}/cart  — clear entire cart
	    @DeleteMapping
	    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
	        cartService.clearCart(userId);
	        return ResponseEntity.noContent().build();
	    }


	   
	 
}
