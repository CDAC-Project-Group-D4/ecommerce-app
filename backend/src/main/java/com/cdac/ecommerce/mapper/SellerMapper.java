package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.SellerResponseDTO;
import com.cdac.ecommerce.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SellerMapper {

    @Mapping(target = "sellerId", source = "id")
    @Mapping(target = "storeId", source = "store.id")
    @Mapping(target = "storeName", source = "store.storeName")
    SellerResponseDTO toDTO(User user);

}
