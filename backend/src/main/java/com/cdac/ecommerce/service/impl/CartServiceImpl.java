package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.CartRequestDTO;
import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.entity.Cart;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.mapper.CartMapper;
import com.cdac.ecommerce.repository.CartRepository;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository; // ASSUMPTION: exists — confirm exact name/package
    private final UserRepo userRepo;
    private final CartMapper cartMapper;

    public CartServiceImpl(CartRepository cartRepository,
                            ProductRepository productRepository,
                            UserRepo userRepo,
                            CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepo = userRepo;
        this.cartMapper = cartMapper;
    }

    @Override
    @Transactional
    public CartResponseDTO addToCart(Long userId, CartRequestDTO requestDTO) {
        Product product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + requestDTO.getProductId()));

        if (!product.isActive() || product.getStock() <= 0) {
            throw new IllegalStateException("Product is unavailable or out of stock");
        }

        // Duplicate check — bump quantity instead of inserting a new row (matches uq_cart constraint)
        return cartRepository.findByUser_IdAndProduct_Id(userId, requestDTO.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + requestDTO.getQuantity());
                    return cartMapper.toResponseDTO(cartRepository.save(existing));
                })
                .orElseGet(() -> {
                    User user = userRepo.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setProduct(product);
                    cart.setQuantity(requestDTO.getQuantity());
                    return cartMapper.toResponseDTO(cartRepository.save(cart));
                });
    }

    //list all carts
    @Override
    @Transactional
    public List<CartResponseDTO> getCartForUser(Long userId) {

        List<Cart> carts = cartRepository.findByUser_Id(userId);
        List<CartResponseDTO> responseList = new ArrayList<>();

        for (Cart cart : carts) {
            responseList.add(cartMapper.toResponseDTO(cart));
        }

        return responseList;
    }

	@Override
	@Transactional
	public CartResponseDTO updateQuantity(Long userId, Long cartItemId, Integer quantity) {
		//find the cart item
		Cart carts=cartRepository.findById(cartItemId)
		.orElseThrow(()->new ResourceNotFoundException("cart item not found with id: "+cartItemId));
		
		//check the ownership of cart
		if(!carts.getUser().getId().equals(userId)) {
			throw new ResourceNotFoundException("cart item not found with id: "+cartItemId);
		}
        if (quantity <= 0) {
            cartRepository.delete(carts);
            return null;
        }
		
		carts.setQuantity(quantity);
		Cart updatedCart = cartRepository.save(carts);
		CartResponseDTO dto = cartMapper.toResponseDTO(updatedCart);
		return dto;
		
	}

	@Override
	@Transactional
	public void removeItem(Long userId, Long cartItemId) {
		Cart carts=cartRepository.findById(cartItemId)
				.orElseThrow(()->new ResourceNotFoundException("cart item not found with id: " +cartItemId));
		//check the ownership of cart
		if(!carts.getUser().getId().equals(userId)) {
			throw new ResourceNotFoundException("cart item not found with id: "+cartItemId);
		}
		cartRepository.deleteById(cartItemId);
	
	}

	@Override
	@Transactional
	public void clearCart(Long userId) {
		List<Cart> items=cartRepository.findByUser_Id(userId);
		cartRepository.deleteAll(items);
	}
	
	
	

   
}