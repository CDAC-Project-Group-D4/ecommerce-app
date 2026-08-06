package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.AdminDisputeActionRequestDto;
import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;
import com.cdac.ecommerce.service.AdminReturnDisputeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/returns")
@RequiredArgsConstructor
public class AdminReturnAndDisputeResolutionController {

    private final AdminReturnDisputeService adminReturnDisputeService;

    @GetMapping
    public ResponseEntity<List<ReturnDisputeResponseDTO>> getAllCustomerEscalatedDisputes(
            @RequestParam(name = "status", required = false) String status) {

        // Default behavior: fetch disputes if status is DISPUTED, ALL, or null/blank
        if (status == null || status.isBlank() || "DISPUTED".equalsIgnoreCase(status) || "ALL".equalsIgnoreCase(status)) {
            List<ReturnDisputeResponseDTO> disputeResponseDTOs = adminReturnDisputeService.getDisputeRequests();
            return ResponseEntity.ok(disputeResponseDTOs);
        }

        return ResponseEntity.badRequest().build();
    }

    @PatchMapping("/{id}/accept-dispute")
    public ResponseEntity<Boolean> acceptDispute(
            @PathVariable("id") Long returnRequestId,
            @RequestBody @Valid AdminDisputeActionRequestDto dto) {

        if (dto != null && dto.adminId() != null) {
            boolean accepted = adminReturnDisputeService.acceptDispute(returnRequestId, dto.adminId(), dto);
            return ResponseEntity.ok(accepted);
        }

        return ResponseEntity.badRequest().build();
    }

    @PatchMapping("/{id}/reject-dispute")
    public ResponseEntity<Boolean> rejectDispute(
            @PathVariable("id") Long returnRequestId,
            @RequestBody @Valid AdminDisputeActionRequestDto dto) {

        if (dto != null && dto.adminId() != null) {
            boolean rejected = adminReturnDisputeService.rejectDispute(returnRequestId, dto.adminId(), dto);
            return ResponseEntity.ok(rejected);
        }

        return ResponseEntity.badRequest().build();
    }
}