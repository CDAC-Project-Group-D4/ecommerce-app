package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.ChangePasswordRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerProfileRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.service.CustomerAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
public class CustomerProfileAndAddressController {

    private final CustomerAddressService customerAddressService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id){
        return ResponseEntity.ok(customerAddressService.getProfile(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody CustomerProfileRequestDTO requestDTO){
        return ResponseEntity.ok(customerAddressService.updateProfile(requestDTO));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO requestDTO){
        customerAddressService.changePassword(requestDTO);
        return ResponseEntity.ok("Change Password successfully");
    }
    @GetMapping("/address")
    public ResponseEntity<List<CustomerAddressResponseDTO>> getAllAddress(){
        return ResponseEntity.ok(customerAddressService.getAllAddress());
    }

    @PostMapping("/address")
    public ResponseEntity<CustomerAddressResponseDTO> addAddress(
            @RequestBody CustomerAddressRequestDTO requestDTO) {

        return new ResponseEntity<>(
                customerAddressService.addAddress(requestDTO),
                HttpStatus.CREATED
        );
    }
    @PutMapping("/address/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody CustomerAddressRequestDTO requestDTO){
        return ResponseEntity.ok(customerAddressService.updateAddress(id,requestDTO));
    }

    @DeleteMapping("/address/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long id){
        customerAddressService.deleteAddress(id);
        return ResponseEntity.ok("Address deleted Successfully");
    }
}
