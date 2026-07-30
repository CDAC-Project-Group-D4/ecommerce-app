package com.cdac.ecommerce.controller;


import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {

    private final StoreService storeService;

    //creating a store
    @PostMapping("/create-store")
    public ResponseEntity<StoreResponseDTO> createStore(@Valid @RequestBody StoreRequestDTO storeRequestDTO){
        StoreResponseDTO storeResponseDTO= storeService.createStore(storeRequestDTO);
        return ResponseEntity.ok(storeResponseDTO);
    }

    //getting the store information
    @GetMapping("/get-store")
    public ResponseEntity<StoreResponseDTO> getStore(){
        StoreResponseDTO storeResponseDTO = storeService.getStore();
        return ResponseEntity.ok(storeResponseDTO);
    }

    //get the orders associated with the store
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> getStoreOrders(){
        List<OrderResponseDTO> orderResponseDTO= storeService.getStoreOrders();
        return ResponseEntity.ok(orderResponseDTO);
    }

    //update the store information like store name, store description etc.
    @PutMapping("/update-store")
    public ResponseEntity<StoreResponseDTO> updateStore(@Valid @RequestBody StoreRequestDTO storeRequestDTO){
        StoreResponseDTO storeResponseDTO= storeService.updateStore(storeRequestDTO);
        return ResponseEntity.ok(storeResponseDTO);
    }


    //delete functionalities

    //hard delete(if store gets deleted, related products should also be deleted)
    @DeleteMapping("/delete-store")
    public ResponseEntity<StoreResponseDTO> deleteStore(){
        StoreResponseDTO storeResponseDTO = storeService.deleteStore();
        return ResponseEntity.ok(storeResponseDTO);
    }

    //soft delete(deactivate the store)
    @PutMapping("/deactivate-store")
    public ResponseEntity<StoreResponseDTO> deactivateStore(){
        StoreResponseDTO storeResponseDTO= storeService.deactivateStore();
        return ResponseEntity.ok(storeResponseDTO);
    }

    //reactivate the store
    @PutMapping("/reactivate-store")
    public ResponseEntity<StoreResponseDTO> reactivateStore(){
        StoreResponseDTO storeResponseDTO= storeService.reactivateStore();
        return ResponseEntity.ok(storeResponseDTO);
    }

    @PostMapping("/upload-media")
    public ResponseEntity<Map<String, String>> uploadMedia(
            @RequestParam(value = "banner", required = false) MultipartFile banner,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        return ResponseEntity.ok(storeService.uploadMedia(banner, profilePhoto));
    }
}
