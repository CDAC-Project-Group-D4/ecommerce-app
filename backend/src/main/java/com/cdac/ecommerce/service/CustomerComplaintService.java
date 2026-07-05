package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.CustomerComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;

import java.util.List;

public interface CustomerComplaintService {
    List<CustomerComplaintResponseDTO> getCustomerComplaintById(Long customerId);

    CustomerComplaintResponseDTO createComplaint(CustomerComplaintRequestDTO complaintRequestDTO);
}
