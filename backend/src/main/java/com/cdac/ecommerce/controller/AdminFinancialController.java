package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.AdminCommissionRequestDTO;
import com.cdac.ecommerce.dto.response.PlatformSettingResponseDTO;
import com.cdac.ecommerce.dto.response.SellerPayoutResponseDTO;
import com.cdac.ecommerce.entity.PlatformSetting;
import com.cdac.ecommerce.entity.SellerCommissionOverride;
import com.cdac.ecommerce.entity.SellerPayout;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.PaymentStatus;
import com.cdac.ecommerce.service.FinancialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
//@PreAuthorize("hasRole('ADMIN')")
public class AdminFinancialController {

    private final FinancialService financialService;

    @GetMapping("/settings/commission")
    public ResponseEntity<PlatformSettingResponseDTO> getLatestCommission(){
        return ResponseEntity.ok(financialService.getLatestCommission());
    }

    @PostMapping("/settings/commission")
    public ResponseEntity<PlatformSettingResponseDTO> updateGlobalCommission(
            @Valid @RequestBody AdminCommissionRequestDTO commissionRequestDTO,
            @AuthenticationPrincipal User adminUser
            ){

        return ResponseEntity.ok(financialService.createGlobalCommission(commissionRequestDTO, adminUser));
    }

    @PostMapping("/sellers/{userId}/commission-override")
    public ResponseEntity<SellerCommissionOverride> setSellerCommissionOverride(
            @PathVariable Long userId,
            @Valid @RequestBody AdminCommissionRequestDTO requestDTO,
            @AuthenticationPrincipal User adminUser
    ){
        return ResponseEntity.ok(financialService.setSellerOverride(userId, requestDTO, adminUser));
    }

    @GetMapping("/payouts")
    public ResponseEntity<Page<SellerPayoutResponseDTO>> getAllPayouts(
            @RequestParam(required = false)PaymentStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
            ){

        return ResponseEntity.ok(financialService.getAllPayouts(status, pageable));
    }

    @PostMapping("/payouts/{sellerId}/release")
    public ResponseEntity<SellerPayoutResponseDTO> releaseSellerPayout(
            @PathVariable Long sellerId,
            @AuthenticationPrincipal User adminUser
    ){
        return ResponseEntity.ok(financialService.releaseSellerPayout(sellerId, adminUser));
    }
}
