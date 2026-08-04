package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.PlatformSettingResponseDTO;
import com.cdac.ecommerce.entity.PlatformSetting;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PlatformSettingMapper {

    @Mapping(target = "updatedByUserId", source = "updatedBy.id")
    @Mapping(target = "updatedByName", source = "updatedBy.fullName")
    PlatformSettingResponseDTO toResponseDto(PlatformSetting platformSetting);

}
