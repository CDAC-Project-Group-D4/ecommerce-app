package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.SellerReturnDecisionDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.ReturnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/returns")
@RequiredArgsConstructor
public class SellerReturnController {

    private final ReturnService returnService;

    @GetMapping
    public ResponseEntity<List<ReturnResponseDTO>> getReturns(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(returnService.getSellerReturns(userDetails.getId()));
    }

    @PatchMapping("/{returnRequestId}/decision")
    public ResponseEntity<ReturnResponseDTO> decide(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long returnRequestId,
            @Valid @RequestBody SellerReturnDecisionDTO requestDTO) {
        return ResponseEntity.ok(returnService.decideReturn(
                userDetails.getId(), returnRequestId, requestDTO));
    }
}
