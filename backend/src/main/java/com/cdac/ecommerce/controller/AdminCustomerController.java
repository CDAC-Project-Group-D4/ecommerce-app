package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.CustomerResponseDTO;
import com.cdac.ecommerce.service.AdminCustomerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService adminService;

    @GetMapping()
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers(){
        List<CustomerResponseDTO> customers = adminService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long customerId){
        CustomerResponseDTO customer = adminService.getCustomerById(customerId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long customerId){
        boolean isDeleted = adminService.deleteCustomer(customerId);
        if(isDeleted){
            return ResponseEntity.ok().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{customerId}")
    @Operation(summary = "Block customer")
    public ResponseEntity<Void> blockUser(@PathVariable Long customerId){
        boolean isBlocked = adminService.blockCustomer(customerId);
        if(isBlocked){
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
}
