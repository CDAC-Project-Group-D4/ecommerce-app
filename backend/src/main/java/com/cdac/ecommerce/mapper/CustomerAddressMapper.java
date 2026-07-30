package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.entity.CustomerAddress;
import org.springframework.stereotype.Component;

@Component
public class CustomerAddressMapper {

    // Entity -> Response DTO
    public CustomerAddressResponseDTO toResponseDTO(CustomerAddress address) {

        CustomerAddressResponseDTO dto = new CustomerAddressResponseDTO();

        dto.setId(address.getId());
        dto.setLabel(address.getLabel());
        dto.setFullName(address.getFullName());
        dto.setMobileNumber(address.getMobileNumber());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setPincode(address.getPincode());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setCountry(address.getCountry());

        return dto;
    }

    // Request DTO -> Entity
    public CustomerAddress toEntity(CustomerAddressRequestDTO dto) {

        CustomerAddress address = new CustomerAddress();

        address.setLabel(dto.getLabel());
        address.setFullName(dto.getFullName());
        address.setMobileNumber(dto.getMobileNumber());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setPincode(dto.getPincode());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setCountry(dto.getCountry());

        return address;
    }

    // Update existing entity
    public void updateEntity(CustomerAddress address,
                             CustomerAddressRequestDTO dto) {

        address.setLabel(dto.getLabel());
        address.setFullName(dto.getFullName());
        address.setMobileNumber(dto.getMobileNumber());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setPincode(dto.getPincode());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setCountry(dto.getCountry());
    }

    public CustomerAddressResponseDTO toResponse(CustomerAddress address) {
        return toResponseDTO(address);
    }
}
