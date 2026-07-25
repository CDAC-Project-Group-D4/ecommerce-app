package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.CartRequestDTO;
import com.cdac.ecommerce.dto.request.WishlistRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.dto.response.WishlistResponseDTO;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.Wishlist;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.mapper.WishlistMapper;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.repository.WishlistRepository;
import com.cdac.ecommerce.service.CartService;
import com.cdac.ecommerce.service.WishlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepo userRepo;
    private final WishlistMapper wishlistMapper;
    private final CartService cartService; // reused for moveToCart, avoids duplicating add/bump logic

    public WishlistServiceImpl(WishlistRepository wishlistRepository,
                               ProductRepository productRepository,
                               UserRepo userRepo,
                               WishlistMapper wishlistMapper,
                               CartService cartService) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepo = userRepo;
        this.wishlistMapper = wishlistMapper;
        this.cartService = cartService;
    }

    @Override
    @Transactional
    public WishlistResponseDTO addToWishlist(Long userId, WishlistRequestDTO requestDTO) {

        // Check if product is already in wishlist
        Wishlist existingWishlist = wishlistRepository
                .findByUser_IdAndProduct_Id(userId, requestDTO.getProductId())
                .orElse(null);

        if (existingWishlist != null) {
            return wishlistMapper.toResponseDTO(existingWishlist);
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toResponseDTO(savedWishlist);
    }
    @Override
    public List<WishlistResponseDTO> getWishlistForUser(Long userId) {

        return wishlistRepository.findByUser_Id(userId)
                .stream()
                .map(wishlistMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long wishlistItemId) {
        Wishlist wishlist = wishlistRepository.findByIdAndUser_Id(wishlistItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found with id: " + wishlistItemId));
        wishlistRepository.delete(wishlist);
    }

    @Override
    @Transactional
    public CartResponseDTO moveToCart(Long userId, Long wishlistItemId) {

        Wishlist wishlist = wishlistRepository.findByIdAndUser_Id(wishlistItemId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Wishlist item not found"));

        CartRequestDTO cartRequest = new CartRequestDTO();
        cartRequest.setProductId(wishlist.getProduct().getId());
        cartRequest.setQuantity(1);

        CartResponseDTO response = cartService.addToCart(userId, cartRequest);

        wishlistRepository.delete(wishlist);

        return response;
    }
}