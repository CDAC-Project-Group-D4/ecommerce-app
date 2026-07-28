package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.entity.CustomerAddress;
import org.springframework.stereotype.Component;

@Component
public class CustomerAddressMapper {

    public CustomerAddressResponseDTO toResponseDTO(CustomerAddress address) {

        CustomerAddressResponseDTO dto = new CustomerAddressResponseDTO();

        dto.setId(address.getId());
        dto.setLabel(address.getLabel());
        dto.setFullName(address.getFullName());
        dto.setMobileNumber(address.getMobileNumber());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setCountry(address.getCountry());
        dto.setPincode(address.getPincode());

        return dto;
    }
}
