package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.request.UserRequestDTO;

import com.cdac.ecommerce.dto.response.UserResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // 1. ENTITY -> DTO
    @Mapping(source = "id", target = "userId")
    UserResponseDTO toResponseDTO(User user);

    // 2. DTO -> ENTITY
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "store", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "blocked", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(UserRequestDTO dto);
}