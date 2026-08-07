package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CategoryAttributeDTO;
import com.cdac.ecommerce.dto.response.CategoryResponseDTO;
import com.cdac.ecommerce.entity.Category;
import com.cdac.ecommerce.entity.ProductAttributeValue;
import com.cdac.ecommerce.exception.ResourceNotFoundException; // Ensure you have custom/runtime exception
import com.cdac.ecommerce.mapper.CategoryMapper;
import com.cdac.ecommerce.repository.CategoryRepository;
import com.cdac.ecommerce.repository.ProductAttributeValueRepository;
import com.cdac.ecommerce.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ProductAttributeValueRepository productAttributeValueRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper,
                               ProductAttributeValueRepository productAttributeValueRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.productAttributeValueRepository = productAttributeValueRepository;
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

    @Override
    public List<CategoryAttributeDTO> getAttributesByCategoryId(Long categoryId) {
        List<ProductAttributeValue> values = productAttributeValueRepository.findDistinctAttributesByCategoryId(categoryId);

        // Group values safely by Attribute ID and Attribute Name
        Map<Long, Map<String, Set<String>>> grouped = values.stream()
                .filter(av -> av.getAttribute() != null && av.getAttribute().getName() != null)
                .collect(Collectors.groupingBy(
                        av -> av.getAttribute().getId(),
                        Collectors.groupingBy(
                                av -> av.getAttribute().getName(),
                                Collectors.mapping(
                                        av -> av.getValue() != null ? av.getValue() : "", // Use field: value
                                        Collectors.toSet()
                                )
                        )
                ));

        // Construct DTO records cleanly
        return grouped.entrySet().stream()
                .flatMap(attrEntry -> {
                    Long attrId = attrEntry.getKey();
                    return attrEntry.getValue().entrySet().stream()
                            .map(nameValEntry -> new CategoryAttributeDTO(
                                    attrId,
                                    nameValEntry.getKey(),
                                    nameValEntry.getValue()
                            ));
                })
                .toList();
    }
}