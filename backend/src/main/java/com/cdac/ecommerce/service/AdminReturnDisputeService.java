package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;

import java.util.List;

public interface AdminReturnDisputeService {
    List<ReturnDisputeResponseDTO> getDisputeRequests();
}
