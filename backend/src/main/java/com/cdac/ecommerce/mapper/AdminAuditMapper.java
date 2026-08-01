package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.AdminAuditLogsResponseDTO;
import com.cdac.ecommerce.entity.AdminAuditLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminAuditMapper {

    @Mapping(target = "adminId", source = "adminUser.id")
    @Mapping(target = "adminEmail", source = "adminUser.email")
    @Mapping(target = "entityName", source = "entity")
    @Mapping(target = "details", source = "description")
    AdminAuditLogsResponseDTO toDTO(AdminAuditLog adminAuditLog);

}
