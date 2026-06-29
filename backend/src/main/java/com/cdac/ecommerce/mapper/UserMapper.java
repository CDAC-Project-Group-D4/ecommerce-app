package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.UserRequestDTO;
import com.cdac.ecommerce.dto.response.UserResponseDTO;
import com.cdac.ecommerce.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// Mapping entity to dtos using mapstruct
@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "userId")
    UserResponseDTO toResponseDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "blocked", constant = "false")
    User toEntity(UserRequestDTO dto);

}
