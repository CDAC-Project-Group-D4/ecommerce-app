package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Full wishlist listing for a user
    List<Wishlist> findByUser_Id(Long userId);

    // Used to prevent duplicate wishlist entries, and to support "already wishlisted?" checks
    Optional<Wishlist> findByUser_IdAndProduct_Id(Long userId, Long productId);

    // Ownership check + fetch in one call — used by move-to-cart and remove
    Optional<Wishlist> findByIdAndUser_Id(Long id, Long userId);

    boolean existsByUser_IdAndProduct_Id(Long userId, Long productId);
}