package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.AdminCommissionRequestDTO;
import com.cdac.ecommerce.dto.response.PlatformSettingResponseDTO;
import com.cdac.ecommerce.dto.response.SellerPayoutResponseDTO;
import com.cdac.ecommerce.entity.SellerCommissionOverride;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.PaymentStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FinancialService {
    PlatformSettingResponseDTO getLatestCommission();

    PlatformSettingResponseDTO createGlobalCommission(@Valid AdminCommissionRequestDTO commissionRequestDTO, User adminUser);

    Page<SellerPayoutResponseDTO> getAllPayouts(PaymentStatus status, Pageable pageable);

    SellerPayoutResponseDTO releaseSellerPayout(Long sellerId, User adminUser);

    SellerCommissionOverride setSellerOverride(Long userId, @Valid AdminCommissionRequestDTO requestDTO, User adminUser);
}
