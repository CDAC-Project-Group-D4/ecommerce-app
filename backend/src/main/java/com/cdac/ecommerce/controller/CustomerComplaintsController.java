package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.CustomerComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;
import com.cdac.ecommerce.entity.CustomerComplaint;
import com.cdac.ecommerce.service.CustomerComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
public class CustomerComplaintsController {

    private final CustomerComplaintService complaintService;

    @GetMapping("/{customerId}")
    public ResponseEntity<List<CustomerComplaintResponseDTO>> getComplaintsByUserId(@PathVariable Long customerId){
        List<CustomerComplaintResponseDTO> list = complaintService.getCustomerComplaintById(customerId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<CustomerComplaintResponseDTO> createComplaint(@RequestBody @Valid CustomerComplaintRequestDTO complaintRequestDTO){
        CustomerComplaintResponseDTO newComplaint = complaintService.createComplaint(complaintRequestDTO);
        return new ResponseEntity<>(newComplaint, HttpStatus.CREATED);
    }

}
