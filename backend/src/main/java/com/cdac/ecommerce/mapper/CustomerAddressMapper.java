//package com.cdac.ecommerce.mapper;
//
//import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
//import com.cdac.ecommerce.entity.CustomerAddress;
//import org.springframework.stereotype.Component;
//
//@Component
//public class CustomerAddressMapper {
//
//    public CustomerAddressResponseDTO toResponseDTO(CustomerAddress address) {
//
//        CustomerAddressResponseDTO dto = new CustomerAddressResponseDTO();
//
//        dto.setId(address.getId());
//        dto.setLabel(address.getLabel());
//        dto.setFullName(address.getFullName());
//        dto.setMobileNumber(address.getMobileNumber());
//        dto.setAddressLine1(address.getAddressLine1());
//        dto.setAddressLine2(address.getAddressLine2());
//        dto.setCity(address.getCity());
//        dto.setState(address.getState());
//        dto.setCountry(address.getCountry());
//        dto.setPincode(address.getPincode());
//
//        return dto;
//    }
//}
package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.entity.CustomerAddress;
import org.springframework.stereotype.Component;

@Component
public class CustomerAddressMapper {

    // Entity -> Response DTO
    public CustomerAddressResponseDTO toResponseDto(CustomerAddress address) {

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

        address.setLabel(dto.label());
        address.setFullName(dto.fullName());
        address.setMobileNumber(dto.mobileNumber());
        address.setAddressLine1(dto.addressLine1());
        address.setAddressLine2(dto.addressLine2());
        address.setPincode(dto.pincode());
        address.setCity(dto.city());
        address.setState(dto.state());
        address.setCountry(dto.country());

        return address;
    }

    // Update existing entity
    public void updateEntity(CustomerAddress address,
                             CustomerAddressRequestDTO dto) {

        address.setLabel(dto.label());
        address.setFullName(dto.fullName());
        address.setMobileNumber(dto.mobileNumber());
        address.setAddressLine1(dto.addressLine1());
        address.setAddressLine2(dto.addressLine2());
        address.setPincode(dto.pincode());
        address.setCity(dto.city());
        address.setState(dto.state());
        address.setCountry(dto.country());
    }
}