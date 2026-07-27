package com.cdac.ecommerce.dto.response;

public record AdminCategoryResponseDTO(
       Long id,
       String name,
       Long parentId,
       boolean active

) {

}
