package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerProductService {


    List<CustomerProductResponseDTO> getAllProducts();


    CustomerProductResponseDTO getProductById(Long id);
}
