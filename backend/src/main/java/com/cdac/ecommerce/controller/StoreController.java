package com.cdac.ecommerce.controller;


import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {

    private final StoreService storeService;

    @PostMapping("/create-store")
    public ResponseEntity<StoreResponseDTO> createStore(@RequestBody StoreRequestDTO storeRequestDTO){
        StoreResponseDTO storeResponseDTO= storeService.createStore(storeRequestDTO);
        return ResponseEntity.ok(storeResponseDTO);
    }

    @GetMapping("/get-store")
    public ResponseEntity<StoreResponseDTO> getStore(){
        StoreResponseDTO storeResponseDTO = storeService.getStore();
        return ResponseEntity.ok(storeResponseDTO);
    }
}
