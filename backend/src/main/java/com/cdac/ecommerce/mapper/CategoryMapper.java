package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CategoryResponseDTO;
import com.cdac.ecommerce.entity.Category;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class CategoryMapper {

    public CategoryResponseDTO toResponseDTO(Category category) {
        if (category == null) return null;

        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .isActive(category.isActive())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .subCategories(category.getSubCategories() != null ?
                        category.getSubCategories().stream()
                                .filter(Category::isActive) // Return only active subcategories
                                .map(this::toResponseDTO)
                                .toList()
                        : Collections.emptyList())
                .build();
    }
}