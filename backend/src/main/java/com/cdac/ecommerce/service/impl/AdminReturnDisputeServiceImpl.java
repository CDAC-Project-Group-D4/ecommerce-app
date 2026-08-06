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
        return returnRequestRepo.findDisputedReturnRequests(Decision.REJECTED)
                .stream()
                .map(returnDisputeMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.APPROVE_RETURN,
            entity = EntityEnum.RETURN_REQUEST,
            entityId = "#returnRequestId",
            description = "Return dispute accepted by admin"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean acceptDispute(Long returnRequestId, Long adminId, AdminDisputeActionRequestDto dto) {
        DisputeContext context = resolveDisputeContext(returnRequestId, adminId);
        ReturnRequest request = context.request();

        String notes = (dto != null && dto.adminNotes() != null && !dto.adminNotes().isBlank())
                ? dto.adminNotes()
                : "Dispute accepted. Refund approved";

        request.setAdminUserId(context.admin());
        request.setAdminDecidedAt(LocalDateTime.now());
        request.setAdminNotes(notes);
        request.setAdminDecision(Decision.APPROVED);

        if (request.getRequestType() == RequestType.RETURN) {
            request.setRefundStatus(RefundStatus.COMPLETED);
            request.setRefundReference("REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        return true;
    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.REJECT_RETURN, // Updated enum value for clarity
            entity = EntityEnum.RETURN_REQUEST,
            entityId = "#returnRequestId",
            description = "Return dispute rejected by admin"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public boolean rejectDispute(Long returnRequestId, Long adminId, AdminDisputeActionRequestDto dto) {
        DisputeContext context = resolveDisputeContext(returnRequestId, adminId);
        ReturnRequest request = context.request();

        String notes = (dto != null && dto.adminNotes() != null && !dto.adminNotes().isBlank())
                ? dto.adminNotes()
                : "Dispute rejected!";

        request.setAdminUserId(context.admin());
        request.setAdminDecidedAt(LocalDateTime.now());
        request.setAdminNotes(notes);
        request.setAdminDecision(Decision.REJECTED);

        if (request.getRequestType() == RequestType.RETURN) {
            request.setRefundStatus(RefundStatus.REJECTED);
        }

        return true;
    }

    private DisputeContext resolveDisputeContext(Long returnRequestId, Long adminId) {
        ReturnRequest request = returnRequestRepo.findById(returnRequestId)
                .orElseThrow(() -> new ReturnRequestNotFoundException("Return request not found with ID: " + returnRequestId));

        if (request.getAdminDecision() != null && request.getAdminDecision() != Decision.PENDING) {
            throw new IllegalStateException("Dispute request #" + returnRequestId + " has already been processed.");
        }

        User admin = userRepo.findById(adminId)
                .orElseThrow(() -> new UserNotFoundException("Admin not found with ID: " + adminId));

        return new DisputeContext(request, admin);
    }

    private record DisputeContext(ReturnRequest request, User admin) {}
}