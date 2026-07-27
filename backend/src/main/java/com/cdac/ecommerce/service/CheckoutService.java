package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.CheckoutResponseDTO;

public interface CheckoutService {
    CheckoutResponseDTO getCheckout(Long userId);

}
