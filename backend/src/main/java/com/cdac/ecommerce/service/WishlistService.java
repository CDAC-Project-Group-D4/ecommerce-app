package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.WishlistRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.dto.response.WishlistResponseDTO;

import java.util.List;

public interface WishlistService {

    WishlistResponseDTO addToWishlist(Long userId, WishlistRequestDTO requestDTO);

    List<WishlistResponseDTO> getWishlistForUser(Long userId);

    void removeFromWishlist(Long userId, Long wishlistItemId);

    CartResponseDTO moveToCart(Long userId, Long wishlistItemId);
}