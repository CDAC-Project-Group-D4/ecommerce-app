package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminCategoryRepository extends JpaRepository<Category,Long>  {

    List<Category> findByIsActiveTrue();
}
