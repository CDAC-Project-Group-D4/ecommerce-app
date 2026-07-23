package com.cdac.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cdac.ecommerce.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{
	    // Checks if the given product already exists in the user's cart
		Optional<Cart> findByUser_IdAndProduct_Id(Long userId,Long productId);
		
		//full cart listing for a user
		List<Cart> findByUser_Id(Long userId);
		
		// Fetch the selected cart items for the logged-in user during checkout
		@Query("SELECT c FROM Cart c WHERE c.user.id = :userId AND c.id IN :cartItemIds")
		    List<Cart> findByUser_IdAndIdIn(@Param("userId") Long userId, @Param("cartItemIds") List<Long> cartItemIds);
		
		// Cleanup after successful checkout — remove only the ordered items, not the whole cart
	    void deleteByIdIn(List<Long> cartItemIds);
	    
		
}
