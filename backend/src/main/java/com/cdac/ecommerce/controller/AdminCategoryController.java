package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.AdminCategoryRequestDTO;
import com.cdac.ecommerce.dto.response.AdminCategoryResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerProductResponseDTO;
import com.cdac.ecommerce.service.AdminCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/categories")
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @GetMapping
    public ResponseEntity<List<AdminCategoryResponseDTO>> getAllCategories() {
        return new ResponseEntity<>(
                adminCategoryService.getAllCategories(),
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AdminCategoryResponseDTO> addCategory(
            @RequestBody AdminCategoryRequestDTO requestDTO) {

        return new ResponseEntity<>(
                adminCategoryService.addCategories(requestDTO),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public  ResponseEntity<AdminCategoryResponseDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody AdminCategoryRequestDTO requestDTO ){
            return new ResponseEntity<>(adminCategoryService.updateCategory(id,requestDTO),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        adminCategoryService.deleteCategory(id);
        return  new ResponseEntity<>("Category deleted successfully",HttpStatus.OK);
    }

}
