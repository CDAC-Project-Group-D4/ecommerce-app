package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.ResolveComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;
import com.cdac.ecommerce.entity.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminComplaintsService {
    Page<CustomerComplaintResponseDTO> getComplaints(Boolean resolved, Pageable pageable);

    CustomerComplaintResponseDTO resolveComplaint(Long id, @Valid ResolveComplaintRequestDTO resolveComplaintRequestDTO, User adminUser);
}
