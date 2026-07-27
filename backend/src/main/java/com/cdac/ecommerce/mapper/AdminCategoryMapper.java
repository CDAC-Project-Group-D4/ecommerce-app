package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.AdminCategoryRequestDTO;
import com.cdac.ecommerce.dto.response.AdminCategoryResponseDTO;
import com.cdac.ecommerce.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminCategoryMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "active", constant = "true")
    Category toEntity(AdminCategoryRequestDTO dto);

    @Mapping(target = "parentId", source = "name")
    AdminCategoryResponseDTO toResponse(Category category);
}
