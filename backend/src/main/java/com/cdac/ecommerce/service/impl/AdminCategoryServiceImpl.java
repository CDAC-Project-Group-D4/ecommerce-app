package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.dto.request.AdminCategoryRequestDTO;
import com.cdac.ecommerce.dto.response.AdminCategoryResponseDTO;
import com.cdac.ecommerce.entity.Category;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.mapper.AdminCategoryMapper;
import com.cdac.ecommerce.repository.AdminCategoryRepository;
import com.cdac.ecommerce.service.AdminCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AdminCategoryServiceImpl implements AdminCategoryService{
    private final AdminCategoryRepository adminCategoryRepository;
    private final AdminCategoryMapper adminCategoryMapper;

    @Override
    @LogAdminAction(
            action = Action.CREATE,
            entity = EntityEnum.CATEGORY,
            entityId = "#result.id",
            description = "A new category was added by the admin"
    )
    public AdminCategoryResponseDTO addCategories(AdminCategoryRequestDTO requestDTO) {
        Category category = adminCategoryMapper.toEntity(requestDTO);

        if (requestDTO.parent_id() != null) {

            Category parent = adminCategoryRepository.findById(requestDTO.parent_id())
                    .orElseThrow(() -> new RuntimeException("Parent Category not found"));

            category.setParent(parent);
        }

        Category savedCategory = adminCategoryRepository.save(category);

        return adminCategoryMapper.toResponse(savedCategory);
    }

    @Override
    @LogAdminAction(
            action = Action.UPDATE_CATEGORY,
            entity = EntityEnum.CATEGORY,
            entityId = "#id",
            description = "A category was updated by the admin"
    )
    public AdminCategoryResponseDTO updateCategory(Long id, AdminCategoryRequestDTO requestDTO) {
        Category category = adminCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(requestDTO.name());

        if (requestDTO.parent_id() != null) {

            Category parent = adminCategoryRepository.findById(requestDTO.parent_id())
                    .orElseThrow(() -> new RuntimeException("Parent Category not found"));

            category.setParent(parent);

        } else {
            category.setParent(null);
        }

        Category updated = adminCategoryRepository.save(category);

        return adminCategoryMapper.toResponse(updated);
    }

    @Override
    @LogAdminAction(
            action = Action.DELETE,
            entity = EntityEnum.CATEGORY,
            entityId = "#id",
            description = "A category was deleted by the admin"
    )
    public void deleteCategory(Long id) {

        Category category = adminCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setActive(false);

        adminCategoryRepository.save(category);

    }
}
