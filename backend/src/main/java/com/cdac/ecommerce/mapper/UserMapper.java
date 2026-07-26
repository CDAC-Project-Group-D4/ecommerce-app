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


    // =========================================================================
    // MAPSTRUCT AUTOMATICALLY MATCHES THESE METHODS BY TYPE SIGNATURE (NO @Named NEEDED)
    // =========================================================================

    /** Converts Set<Roles> to Set<String> for UserResponseDTO */
    default Set<String> mapRolesToStrings(Set<Roles> roles) {
        if (roles == null || roles.isEmpty()) {
            return Collections.emptySet();
        }
        return roles.stream()
                .map(Roles::name)
                .collect(Collectors.toSet());
    }

    /** Converts Set<String> to Set<Roles> for User Entity */
    default Set<Roles> mapStringsToRoles(Set<String> roleStrings) {
        if (roleStrings == null || roleStrings.isEmpty()) {
            return Collections.emptySet();
        }
        return roleStrings.stream()
                .map(String::toUpperCase)
                .map(Roles::valueOf)
                .collect(Collectors.toSet());
    }
}