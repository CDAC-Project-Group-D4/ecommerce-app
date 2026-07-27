package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.ProductRequestDTO;
import com.cdac.ecommerce.dto.request.UpdateProductRequestDTO;
import com.cdac.ecommerce.dto.response.ProductResponseDTO;
import com.cdac.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class  ProductController {
    private final ProductService productService;

    @PostMapping("/create-product")
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO productRequestDTO){
        ProductResponseDTO productResponseDTO= productService.createProduct(productRequestDTO);
        return ResponseEntity.ok(productResponseDTO);
    }

    @GetMapping("/get-product")
    public ResponseEntity<List<ProductResponseDTO>> getProduct(){
        List<ProductResponseDTO> productResponseDTO= productService.getProduct();
        return ResponseEntity.ok(productResponseDTO);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponseDTO>> getLowStockProducts(){
        List<ProductResponseDTO> productResponseDTO= productService.getLowStockProducts();
        return ResponseEntity.ok(productResponseDTO);
    }

    @PutMapping("/update-product/{productId}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long productId, @Valid @RequestBody UpdateProductRequestDTO updateProductRequestDTO){
        ProductResponseDTO productResponseDTO= productService.updateProduct(productId, updateProductRequestDTO);
        return ResponseEntity.ok(productResponseDTO);
    }

    @DeleteMapping("/delete-product/{productId}")
    public ResponseEntity<ProductResponseDTO> deleteProduct(@PathVariable Long productId){
        ProductResponseDTO productResponseDTO = productService.deleteProduct(productId);
        return ResponseEntity.ok(productResponseDTO);
    }

}
