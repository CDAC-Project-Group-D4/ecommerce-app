package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.dto.response.ProductAttributeDTO;
import com.cdac.ecommerce.dto.response.ProductCardDTO;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.ProductAttributeValue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CustomerProductMapper {

    @Mapping(target = "productId", source = "id")
    @Mapping(target = "storeId", source = "store.id")
    @Mapping(target = "categoryId", source = "category.id")
    CustomerProductResponseDTO toDto(Product product);

    @Named("mapUniqueAttributes")
    default List<ProductAttributeDTO> mapUniqueAttributes(List<ProductAttributeValue> attributeValues) {
        if (attributeValues == null) return Collections.emptyList();

        return attributeValues.stream()
                .filter(av -> av.getAttribute() != null && av.getAttribute().getName() != null)
                .collect(Collectors.toMap(
                        av -> av.getAttribute().getName(),
                        av -> new ProductAttributeDTO(av.getAttribute().getName(), av.getValue()),
                        (existing, replacement) -> existing // Deduplicate: keeps the first instance found
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    @Mapping(target = "storeName", source = "store.storeName")
    @Mapping(target = "attributes", source = "attributeValues", qualifiedByName = "mapUniqueAttributes")
    ProductCardDTO toCardDTO(Product product);

    @Mapping(target = "name", source = "attribute.name")
    @Mapping(target = "value", source = "value")
    ProductAttributeDTO toAttributeDto(ProductAttributeValue attributeValue);
}