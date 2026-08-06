package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CategoryResponseDTO;
import com.cdac.ecommerce.entity.Category;
import com.cdac.ecommerce.exception.ResourceNotFoundException; // Ensure you have custom/runtime exception
import com.cdac.ecommerce.mapper.CategoryMapper;
import com.cdac.ecommerce.repository.CategoryRepository;
import com.cdac.ecommerce.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<CategoryResponseDTO> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(categoryMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<CategoryResponseDTO> getRootCategories() {
        return categoryRepository.findByIsActiveTrueAndParentIsNull().stream()
                .map(categoryMapper::toResponseDTO)
                .toList();
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));

        return categoryMapper.toResponseDTO(category);
    }
}