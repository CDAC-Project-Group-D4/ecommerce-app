package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerProductMapper {

    @Mapping(target ="productId", source="id")
    @Mapping(target="storeId",source="store.id")
    @Mapping(target="categoryId",source="category.id")
    CustomerProductResponseDTO toDto(Product product);

}
