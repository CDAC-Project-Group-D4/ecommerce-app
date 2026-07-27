package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.ProductRequestDTO;
import com.cdac.ecommerce.dto.request.UpdateProductRequestDTO;
import com.cdac.ecommerce.dto.response.ProductResponseDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO);

    ProductResponseDTO updateProduct(Long productId, UpdateProductRequestDTO updateProductRequestDTO);

    ProductResponseDTO deleteProduct(Long productId);

    List<ProductResponseDTO> getProduct();

    List<ProductResponseDTO> getLowStockProducts();
}
