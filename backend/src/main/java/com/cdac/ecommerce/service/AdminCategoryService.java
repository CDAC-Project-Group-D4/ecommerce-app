package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.AdminCategoryRequestDTO;
import com.cdac.ecommerce.dto.response.AdminCategoryResponseDTO;

public interface AdminCategoryService {
    AdminCategoryResponseDTO addCategories(AdminCategoryRequestDTO requestDTO);


    AdminCategoryResponseDTO updateCategory(Long id, AdminCategoryRequestDTO requestDTO);

    void deleteCategory(Long id);
}
