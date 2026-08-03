package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.dto.response.SellerResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.SellerMapper;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.AdminSellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSellerServiceImpl implements AdminSellerService {

    private final UserRepo userRepo;
    private final SellerMapper sellerMapper;

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<SellerResponseDTO> getAllSellers() {

        List<User> sellers = userRepo.findAllSellers();

        List<SellerResponseDTO> responseDTOS = sellers.stream().map((seller) -> sellerMapper.toDTO(seller)).toList();

        return responseDTOS;

    }

    @Override
    @LogAdminAction(
            action = Action.BLOCK,
            entityId = "#sellerId",
            entity = EntityEnum.USER,
            description = "seller blocked by admin"
    )
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public boolean blockSeller(Long sellerId) {

        User seller = userRepo.findById(sellerId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if(seller.isBlocked()) return false;

        int count = userRepo.blockSeller(sellerId);

        return count > 0;
    }

    @Override
    @LogAdminAction(
            action = Action.UNBLOCK,
            entity = EntityEnum.USER,
            entityId = "#sellerId",
            description = "seller was unblocked by admin"
    )
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public boolean unblockSeller(Long sellerId) {
        User seller = userRepo.findById(sellerId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if(!seller.isBlocked()) return false;

        int count = userRepo.unblockSeller(sellerId);

        return count > 0;
    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.DELETE,
            entity = EntityEnum.USER,
            entityId = "#sellerId",
            description = "seller deleted by admin"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteSeller(Long sellerId) {
        User seller = userRepo.findById(sellerId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        int count = userRepo.softDeleteUser(sellerId);

        if(seller.getStore() != null){
            seller.getStore().setActive(false);
        }

        return count>0;
    }
}
