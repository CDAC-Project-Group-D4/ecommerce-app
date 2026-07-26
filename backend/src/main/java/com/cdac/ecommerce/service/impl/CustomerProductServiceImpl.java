package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.exception.ProductNotFoundException;
import com.cdac.ecommerce.mapper.CustomerProductMapper;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.service.CustomerProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomerProductServiceImpl implements CustomerProductService {

    private final ProductRepository productRepository;
    private final CustomerProductMapper customerProductMapper;

    @Override
    public List<CustomerProductResponseDTO> getAllProducts() {
        List<Product> productList= productRepository.findByIs_activeTrue();
        return productList.stream().map(product -> customerProductMapper.toDto(product)).toList();
    }

    @Override
    public CustomerProductResponseDTO getProductById(Long id) {

       Product product=productRepository.findById(id).orElseThrow(()->new ProductNotFoundException("Product not found"));
       return customerProductMapper.toDto(product);

    }

//    ProductResponseDTO somethingDto(Product product){
//        return productMapper.toDto(product);
//    }


}
