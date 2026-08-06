package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.CustomerComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;
import com.cdac.ecommerce.entity.CustomerComplaint;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerComplaintMapper {

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "resolvedBy.id", target = "resolvedBy")
    @Mapping(source = "id", target = "complaintId")
    @Mapping(source = "customer.fullName", target = "customerName")
    CustomerComplaintResponseDTO toDto(CustomerComplaint customerComplaint);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "resolvedBy", ignore = true)
    CustomerComplaint toEntity(CustomerComplaintRequestDTO dto);
}
