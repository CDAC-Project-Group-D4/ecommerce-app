package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.CategoryAttributeDTO;
import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.dto.response.ProductCardDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public interface CustomerProductService {


//    List<CustomerProductResponseDTO> getAllProducts();


    CustomerProductResponseDTO getProductById(Long id);

    Page<ProductCardDTO> getProducts(Long categoryId, String search, BigDecimal minPrice, BigDecimal maxPrice, Map<String, String> allParams, Pageable pageable);

}
