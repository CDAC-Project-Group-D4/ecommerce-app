package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;
import com.cdac.ecommerce.entity.ReturnRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReturnDisputeMapper {

    @Mapping(target = "returnRequestId", source = "id")
    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "orderItemId", source = "orderItem.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userEmail", source = "user.email")
    ReturnDisputeResponseDTO toDto(ReturnRequest request);
}
