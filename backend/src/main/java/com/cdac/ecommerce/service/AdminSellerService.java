package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.SellerResponseDTO;

import java.util.List;

public interface AdminSellerService {
    List<SellerResponseDTO> getAllSellers();
}
