package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {


    // Used by CartService to validate a product is still sellable before adding to cart
    // NOTE: using an explicit @Query here instead of a derived method name (findByIs_active)
    // because Spring Data's name parser splits on underscores and gets confused by the
    // underscore inside the field name "is_active" itself. Explicit JPQL sidesteps that.
    @Query("SELECT p FROM Product p WHERE p.is_active = :isActive")
    List<Product> findByActiveStatus(@Param("isActive") boolean isActive);

    // Optional but likely useful later for store/seller module and category browsing
    List<Product> findByStore_Id(Long storeId);

    List<Product> findByCategory_Id(Long categoryId);

    @Query("Select p FROM Product p WHERE p.is_active = true")
    List<Product> findByIs_activeTrue();

    @Override
    Optional<Product> findById(Long id);
}