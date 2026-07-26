package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.SellerResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.SellerMapper;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.AdminSellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSellerServiceImpl implements AdminSellerService {

    private final UserRepo userRepo;
    private final SellerMapper sellerMapper;

    @Override
    public List<SellerResponseDTO> getAllSellers() {

        List<User> sellers = userRepo.findAllSellers();

        List<SellerResponseDTO> responseDTOS = sellers.stream().map((seller) -> sellerMapper.toDTO(seller)).toList();

        return responseDTOS;

    }

    @Override
    public boolean blockSeller(Long sellerId) {

        User seller = userRepo.findById(sellerId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if(seller.isBlocked()) return false;

        int count = userRepo.blockSeller(sellerId);

        return count > 0;
    }

    @Override
    public boolean unblockSeller(Long sellerId) {
        User seller = userRepo.findById(sellerId).orElseThrow(() -> new UserNotFoundException("User not found!"));

        if(!seller.isBlocked()) return false;

        int count = userRepo.unblockSeller(sellerId);

        return count > 0;
    }
}
