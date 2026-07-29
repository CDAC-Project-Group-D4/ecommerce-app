package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.ChangePasswordRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerProfileRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerProfileResponseDTO;

import java.util.List;

public interface CustomerAddressService {
    CustomerProfileResponseDTO getProfile(Long id);

    CustomerProfileResponseDTO updateProfile(CustomerProfileRequestDTO requestDTO);

    void changePassword(ChangePasswordRequestDTO requestDTO);

    List<CustomerAddressResponseDTO> getAllAddress();

    CustomerAddressResponseDTO addAddress(CustomerAddressRequestDTO requestDTO);

    CustomerAddressResponseDTO updateAddress(Long id,
                                             CustomerAddressRequestDTO requestDTO);

    String deleteAddress(Long id);
}
