package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.service.CustomerProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class CustomerProductController {
   private final CustomerProductService customerProductService;

    public CustomerProductController(CustomerProductService customerProductService) {

        this.customerProductService = customerProductService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerProductResponseDTO>> getAllProducts(){
        return new ResponseEntity<>(customerProductService.getAllProducts(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<CustomerProductResponseDTO> getProductById(Long id){
        return new ResponseEntity<>(customerProductService.getProductById(id),HttpStatus.OK);
    }
}
