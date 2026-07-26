package com.cdac.ecommerce.controller;


import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

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

    @PutMapping("/update-store")
    public ResponseEntity<StoreResponseDTO> updateStore(@RequestBody StoreRequestDTO storeRequestDTO){
        StoreResponseDTO storeResponseDTO= storeService.updateStore(storeRequestDTO);
        return ResponseEntity.ok(storeResponseDTO);
    }

    @DeleteMapping("/delete-store")
    public ResponseEntity<StoreResponseDTO> deleteStore(){
        StoreResponseDTO storeResponseDTO = storeService.deleteStore();
        return ResponseEntity.ok(storeResponseDTO);
    }

    @PostMapping("/upload-media")
    public ResponseEntity<Map<String, String>> uploadMedia(
            @RequestParam(value = "banner", required = false) MultipartFile banner,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        return ResponseEntity.ok(storeService.uploadMedia(banner, profilePhoto));
    }
}
