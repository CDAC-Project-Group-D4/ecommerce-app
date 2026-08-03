package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.dto.request.AdminDisputeActionRequestDto;
import com.cdac.ecommerce.dto.response.ReturnDisputeResponseDTO;
import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.Decision;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.entity.enums.RefundStatus;
import com.cdac.ecommerce.entity.enums.RequestType;
import com.cdac.ecommerce.exception.ReturnRequestNotFoundException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.ReturnDisputeMapper;
import com.cdac.ecommerce.repository.ReturnRequestRepo;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.AdminReturnDisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminReturnDisputeServiceImpl implements AdminReturnDisputeService {

    private final ReturnRequestRepo returnRequestRepo;
    private final ReturnDisputeMapper returnDisputeMapper;
    private final UserRepo userRepo;

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReturnDisputeResponseDTO> getDisputeRequests() {

        List<ReturnRequest> returnRequests = returnRequestRepo.findDisputedReturnRequests(Decision.REJECTED);

        return returnRequests
                .stream()
                .map(request -> returnDisputeMapper.toDto(request))
                .toList();

    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.APPROVE_RETURN,
            entity = EntityEnum.RETURN_REQUEST,
            entityId = "#returnRequestId",
            description = "Return approved by admin"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean acceptDispute(Long returnRequestId, Long adminId, AdminDisputeActionRequestDto dto) {
        ReturnRequest request = returnRequestRepo.findById(returnRequestId)
                .orElseThrow(() -> new ReturnRequestNotFoundException("Return request not found!"));

        User admin = userRepo.findById(adminId)
                .orElseThrow(() -> new UserNotFoundException("Admin with Id " + adminId + " not found!"));

        request.setAdminUserId(admin);
        request.setAdminDecidedAt(LocalDateTime.now());
        request.setAdminNotes(dto.adminNotes() != null ? dto.adminNotes() : "Dispute accepted. Refund approved");
        request.setAdminDecision(Decision.APPROVED);
        if (request.getRequestType() == RequestType.RETURN) {
            request.setRefundStatus(RefundStatus.COMPLETED);
            request.setRefundReference(
                    "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        ReturnRequest savedRequest = returnRequestRepo.save(request);
        return true;
    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.APPROVE_REJECT,
            entity = EntityEnum.RETURN_REQUEST,
            entityId = "#returnRequestId",
            description = "admin rejected the dispute"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public boolean rejectDispute(Long returnRequestId, Long adminId, AdminDisputeActionRequestDto dto) {
        ReturnRequest request = returnRequestRepo.findById(returnRequestId)
                .orElseThrow(() -> new ReturnRequestNotFoundException("Return request not found!"));

        User admin = userRepo.findById(adminId)
                .orElseThrow(() -> new UserNotFoundException("Admin with Id " + adminId + " not found!"));

        request.setAdminUserId(admin);
        request.setAdminDecidedAt(LocalDateTime.now());
        request.setAdminNotes(dto.adminNotes() != null ? dto.adminNotes() : "Dispute rejected!");
        request.setAdminDecision(Decision.REJECTED);
        if (request.getRequestType() == RequestType.RETURN) {
            request.setRefundStatus(RefundStatus.REJECTED);
        }

        ReturnRequest savedRequest = returnRequestRepo.save(request);
        return true;
    }
}
