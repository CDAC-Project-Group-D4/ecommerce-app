package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.dto.response.ProductCardDTO;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.exception.ProductNotFoundException;
import com.cdac.ecommerce.mapper.CustomerProductMapper;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.service.CustomerProductService;
import com.cdac.ecommerce.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
@RequiredArgsConstructor
@Service
public class CustomerProductServiceImpl implements CustomerProductService {

    private final ProductRepository productRepository;
    private final CustomerProductMapper customerProductMapper;

//    @Override
//    public List<CustomerProductResponseDTO> getAllProducts() {
//        List<Product> productList= productRepository.findByIs_activeTrue();
//        return productList.stream().map(product -> customerProductMapper.toDto(product)).toList();
//    }

    @Override
    public CustomerProductResponseDTO getProductById(Long id) {

       Product product=productRepository.findById(id).orElseThrow(()->new ProductNotFoundException("Product not found"));
       return customerProductMapper.toDto(product);

    }

//    ProductResponseDTO somethingDto(Product product){
//        return productMapper.toDto(product);
//    }

    @Override
    public Page<ProductCardDTO> getProducts(
            Long categoryId,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sort) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                getSort(sort)
        );

        Page<Product> products = productRepository.findAll(
                ProductSpecification.filter(
                        categoryId,
                        search,
                        minPrice,
                        maxPrice
                ),
                pageable
        );

        return products.map(customerProductMapper::toCardDTO);
    }

    private Sort getSort(String sort){

        return switch (sort){

            case "price_asc" ->
                    Sort.by("price").ascending();

            case "price_desc" ->
                    Sort.by("price").descending();

            case "newest" ->
                    Sort.by("createdAt").descending();

            default ->
                    Sort.by("id").ascending();
        };
    }
}
