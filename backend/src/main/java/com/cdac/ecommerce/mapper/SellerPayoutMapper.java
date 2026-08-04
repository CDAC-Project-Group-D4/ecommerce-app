package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.SellerPayoutResponseDTO;
import com.cdac.ecommerce.entity.SellerPayout;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SellerPayoutMapper {

    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "sellerName", source = "seller.fullName")
    @Mapping(target = "sellerEmail", source = "seller.email")
    SellerPayoutResponseDTO toResponseDto(SellerPayout payout);

}
