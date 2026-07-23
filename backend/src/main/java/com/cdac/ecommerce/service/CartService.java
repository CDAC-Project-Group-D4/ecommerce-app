package com.cdac.ecommerce.service;

import java.util.List;

import com.cdac.ecommerce.dto.request.CartRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;

public interface CartService {
	//if (user,product) already exists,increase only quantity of tat product instead of creatin a duplicate row
	CartResponseDTO addToCart(Long userId,CartRequestDTO requestDto);
	
	List<CartResponseDTO> getCartForUser(Long userId);
	
	// Update quantity on an existing cart row. Ownership is checked —
    // a user can only update their own cart item.
    CartResponseDTO updateQuantity(Long userId, Long cartItemId, Integer quantity);
    
    // Remove a single cart row
    void removeItem(Long userId, Long cartItemId);
    
    // Clear entire cart (e.g. "empty cart" button)
    void clearCart(Long userId);

}
