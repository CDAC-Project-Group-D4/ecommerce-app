package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.dto.request.AdminCommissionRequestDTO;
import com.cdac.ecommerce.dto.response.PlatformSettingResponseDTO;
import com.cdac.ecommerce.dto.response.SellerPayoutResponseDTO;
import com.cdac.ecommerce.entity.PlatformSetting;
import com.cdac.ecommerce.entity.SellerCommissionOverride;
import com.cdac.ecommerce.entity.SellerPayout;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.entity.enums.PaymentStatus;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.PlatformSettingMapper;
import com.cdac.ecommerce.mapper.SellerPayoutMapper;
import com.cdac.ecommerce.repository.PlatformSettingRepository;
import com.cdac.ecommerce.repository.SellerCommissionOverrideRepository;
import com.cdac.ecommerce.repository.SellerPayoutRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.FinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FinancialServiceImpl implements FinancialService {

    private final PlatformSettingRepository platformSettingRepository;
    private final SellerCommissionOverrideRepository sellerCommissionOverrideRepository;
    private final SellerPayoutRepository sellerPayoutRepository;
    private final PlatformSettingMapper platformSettingMapper;
    private final SellerPayoutMapper sellerPayoutMapper;
    private final UserRepo userRepo;

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public PlatformSettingResponseDTO getLatestCommission() {
        PlatformSetting setting = platformSettingRepository.findFirstByIdNotNullOrderByCreatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Platform commission setting not found"));

        return platformSettingMapper.toResponseDto(setting);
    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.CREATE,
            entity = EntityEnum.PLATFORM_SETTINGS,
            description = "Created a new append only global commission rate entry"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public PlatformSettingResponseDTO createGlobalCommission(AdminCommissionRequestDTO commissionRequestDTO, User adminUser) {
        PlatformSetting newSetting = new PlatformSetting();
        newSetting.setCommissionPercentage(commissionRequestDTO.percentage());
        newSetting.setUpdatedBy(adminUser);

        PlatformSetting savedSetting = platformSettingRepository.save(newSetting);
        return platformSettingMapper.toResponseDto(savedSetting);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public Page<SellerPayoutResponseDTO> getAllPayouts(PaymentStatus status, Pageable pageable) {
        Page<SellerPayout> payouts;
        if (status != null) {
            payouts = sellerPayoutRepository.findByStatus(status, pageable);
        } else {
            payouts = sellerPayoutRepository.findAll(pageable);
        }

        // Fixes type mismatch & converts Lazy Proxy entities to DTOs
        return payouts.map(sellerPayoutMapper::toResponseDto);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @LogAdminAction(
            action = Action.UPDATE,
            entity = EntityEnum.SELLER_PAYOUT,
            entityId = "#sellerId",
            description = "seller payout was released by admin"
    )
    public SellerPayoutResponseDTO releaseSellerPayout(Long sellerId, User adminUser) {
        SellerPayout payout = sellerPayoutRepository.findBySeller_IdAndStatus(sellerId, PaymentStatus.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("No pending payout record found for seller Id: " + sellerId));

        payout.setStatus(PaymentStatus.COMPLETED);
        payout.setProcessedAt(LocalDateTime.now());

        SellerPayout savedPayout = sellerPayoutRepository.save(payout);
        return sellerPayoutMapper.toResponseDto(savedPayout);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @LogAdminAction(
            action = Action.CREATE,
            entity = EntityEnum.SELLER_COMMISSION_OVERRIDE,
            entityId = "#sellerId",
            description = "New commission was set by admin"
    )
    public SellerCommissionOverride setSellerOverride(Long sellerId, AdminCommissionRequestDTO requestDTO, User adminUser) {
        User seller = userRepo.findById(sellerId)
                .orElseThrow(() -> new UserNotFoundException("Seller not found!"));

        SellerCommissionOverride override = sellerCommissionOverrideRepository.findBySeller_Id(sellerId)
                .orElse(new SellerCommissionOverride());

        override.setSeller(seller);
        override.setCommissionPercentage(requestDTO.percentage());
        override.setSetBy(adminUser);

        return sellerCommissionOverrideRepository.save(override);
    }
}