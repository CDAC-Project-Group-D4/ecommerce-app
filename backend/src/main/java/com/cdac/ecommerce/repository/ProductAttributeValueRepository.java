package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAttributeValueRepository extends JpaRepository<ProductAttributeValue, Long> {

    @Query("SELECT DISTINCT av FROM ProductAttributeValue av " +
            "JOIN FETCH av.attribute a " +
            "WHERE av.product.category.id = :categoryId AND av.product.isActive = true")
    List<ProductAttributeValue> findDistinctAttributesByCategoryId(@Param("categoryId") Long categoryId);
}
