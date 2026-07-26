package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.SellerResponseDTO;
import com.cdac.ecommerce.service.AdminSellerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/sellers")
@RequiredArgsConstructor
public class AdminSellerController {

    private final AdminSellerService adminSellerService;

    @GetMapping
    @Operation(summary = "Get all sellers")
    public ResponseEntity<List<SellerResponseDTO>> getAllSellers(){

        List<SellerResponseDTO> sellerDTOS = adminSellerService.getAllSellers();
        return new ResponseEntity<>(sellerDTOS, HttpStatus.OK);
    }

}
