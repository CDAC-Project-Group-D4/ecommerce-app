package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;
import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.enums.Decision;
import com.cdac.ecommerce.mapper.ReturnDisputeMapper;
import com.cdac.ecommerce.repository.ReturnRequestRepo;
import com.cdac.ecommerce.service.AdminReturnDisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReturnDisputeServiceImpl implements AdminReturnDisputeService {

    private final ReturnRequestRepo returnRequestRepo;
    private final ReturnDisputeMapper returnDisputeMapper;

    @Override
    public List<ReturnDisputeResponseDTO> getDisputeRequests() {

        List<ReturnRequest> returnRequests = returnRequestRepo.findDisputedReturnRequests(Decision.REJECTED);

        return returnRequests
                .stream()
                .map(request -> returnDisputeMapper.toDto(request))
                .toList();

    }
}
