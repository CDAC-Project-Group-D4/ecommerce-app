package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;
import com.cdac.ecommerce.service.AdminReturnDisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/returns")
@RequiredArgsConstructor
public class AdminReturnAndDisputeResolutionController {

    private final AdminReturnDisputeService adminReturnDisputeService;

    @GetMapping()
    public ResponseEntity<List<ReturnDisputeResponseDTO>> getAllCustomerEscalatedDisputes(
            @RequestParam(name = "status", required = false) String status){

        if("DISPUTED".equalsIgnoreCase(status)){
            List<ReturnDisputeResponseDTO> disputeResponseDTOS = adminReturnDisputeService.getDisputeRequests();
            return ResponseEntity.ok(disputeResponseDTOS);
        }

        return ResponseEntity.badRequest().build();

    }
}
