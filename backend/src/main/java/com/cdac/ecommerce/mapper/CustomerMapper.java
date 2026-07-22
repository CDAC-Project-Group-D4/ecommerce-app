package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CustomerResponseDTO;
import com.cdac.ecommerce.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

//    @Mapping(source = "role", target = "role")
    CustomerResponseDTO toDto(User user);

}
