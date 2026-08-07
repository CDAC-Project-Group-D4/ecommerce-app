package com.cdac.ecommerce.dto.response;

import java.util.Set;

public record CategoryAttributeDTO(
        Long id,
        String name,
        Set<String> values
) {
}
