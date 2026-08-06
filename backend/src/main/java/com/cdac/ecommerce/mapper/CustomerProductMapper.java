package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.dto.response.ProductCardDTO;
import com.cdac.ecommerce.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerProductMapper {

    @Mapping(target ="productId", source="id")
    @Mapping(target="storeId",source="store.id")
    @Mapping(target="categoryId",source="category.id")

    CustomerProductResponseDTO toDto(Product product);

    // Product Listing API
//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "name", source = "name")
//    @Mapping(target = "storeName", source = "store.storeName")
////    @Mapping(target = "thumbnailUrl", source = "thumbnailUrl")
//    ProductCardDTO toCardDTO(Product product);
        @Mapping(target = "storeName", source = "store.storeName")
        ProductCardDTO toCardDTO(Product product);
}
