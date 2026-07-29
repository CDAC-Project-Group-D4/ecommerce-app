package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.response.CheckoutResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;

public interface CheckoutService {
    CheckoutResponseDTO getCheckout(Long userId);

    CustomerAddressResponseDTO addAddress(Long userId, CustomerAddressRequestDTO request);
}
