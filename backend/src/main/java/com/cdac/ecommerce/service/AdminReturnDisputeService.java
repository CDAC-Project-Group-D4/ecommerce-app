package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.AdminDisputeActionRequestDto;
import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminReturnDisputeService {
    List<ReturnDisputeResponseDTO> getDisputeRequests();

    Boolean acceptDispute(Long returnRequestId, Long adminId, @Valid AdminDisputeActionRequestDto dto);

    boolean rejectDispute(Long returnRequestId, @NotNull(message = "Admin id can't be left blank") Long adminId, @Valid AdminDisputeActionRequestDto dto);
}
