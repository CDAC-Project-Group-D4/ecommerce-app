package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.SellerResponseDTO;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.AdminSellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSellerServiceImpl implements AdminSellerService {

    private final UserRepo userRepo;

    @Override
    public List<SellerResponseDTO> getAllSellers() {
        return List.of();
    }
}
