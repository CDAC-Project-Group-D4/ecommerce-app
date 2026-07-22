package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.CustomerResponseDTO;
import com.cdac.ecommerce.entity.User;

import java.util.List;

public interface AdminCustomerService {
    List<CustomerResponseDTO> getAllCustomers();

    boolean deleteCustomer(Long customerId);

    boolean blockCustomer(Long customerId);

    CustomerResponseDTO getCustomerById(Long customerId);
}
