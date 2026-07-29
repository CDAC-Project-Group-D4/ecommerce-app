package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.dto.response.ProductCardDTO;
import com.cdac.ecommerce.service.CustomerProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class CustomerProductController {
   private final CustomerProductService customerProductService;

    public CustomerProductController(CustomerProductService customerProductService) {

        this.customerProductService = customerProductService;
    }
//
//    @GetMapping
//    public ResponseEntity<List<CustomerProductResponseDTO>> getAllProducts(){
//        return new ResponseEntity<>(customerProductService.getAllProducts(), HttpStatus.OK);
//    }

    @GetMapping
    public ResponseEntity<Page<ProductCardDTO>> getProducts(

            @RequestParam(required = false) Long categoryId,

            @RequestParam(required = false) String search,

            @RequestParam(required = false) BigDecimal minPrice,

            @RequestParam(required = false) BigDecimal maxPrice,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "id") String sort

    ) {

        return ResponseEntity.ok(
                customerProductService.getProducts(
                        categoryId,
                        search,
                        minPrice,
                        maxPrice,
                        page,
                        size,
                        sort
                )
        );
    }





    @GetMapping("/{id}")
    public ResponseEntity<CustomerProductResponseDTO> getProductById(Long id){
        return new ResponseEntity<>(customerProductService.getProductById(id),HttpStatus.OK);
    }
}
