package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.CategoryAttributeDTO;
import com.cdac.ecommerce.dto.response.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDTO> getAllActiveCategories();
    List<CategoryResponseDTO> getRootCategories();
    CategoryResponseDTO getCategoryById(Long id);

    List<CategoryAttributeDTO> getAttributesByCategoryId(Long categoryId);
}