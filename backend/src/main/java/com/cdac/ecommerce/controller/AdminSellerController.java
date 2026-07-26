package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.SellerResponseDTO;
import com.cdac.ecommerce.service.AdminSellerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PatchMapping("/{sellerId}/block")
    @Operation(summary = "Block seller")
    public ResponseEntity<Boolean> blockSeller(@PathVariable Long sellerId){


        boolean deleted = adminSellerService.blockSeller(sellerId);

        if(deleted){
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.noContent().build();
        }
    }

    @PatchMapping("/{sellerId}/unblock")
    @Operation(summary = "unblock seller")
    public ResponseEntity<Boolean> unblockSeller(@PathVariable Long sellerId){


        boolean deleted = adminSellerService.unblockSeller(sellerId);

        if(deleted){
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.noContent().build();
        }
    }

    @DeleteMapping("/{sellerId}")
    @Operation(summary = "Soft delete seller")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long sellerId){

        boolean deleted = adminSellerService.deleteSeller(sellerId);

        if(deleted){
            return ResponseEntity.noContent().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }

    }




}
