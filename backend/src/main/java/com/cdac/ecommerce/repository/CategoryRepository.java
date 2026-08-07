package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Fetch all active main/root categories (parent is null)
    List<Category> findByIsActiveTrueAndParentIsNull();

    // Fetch all active categories
    List<Category> findByIsActiveTrue();
}