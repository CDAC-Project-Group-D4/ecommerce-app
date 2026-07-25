package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;

public interface StoreService {

    StoreResponseDTO createStore(StoreRequestDTO storeRequestDTO);

    StoreResponseDTO getStore();
}
