package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.dto.request.ResolveComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;
import com.cdac.ecommerce.entity.CustomerComplaint;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.exception.ComplaintNotFoundException;
import com.cdac.ecommerce.mapper.CustomerComplaintMapper;
import com.cdac.ecommerce.repository.CustomerComplaintRepo;
import com.cdac.ecommerce.service.AdminComplaintsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminComplaintsServiceImpl implements AdminComplaintsService {

    private final CustomerComplaintRepo complaintRepo;
    private final CustomerComplaintMapper complaintMapper;

    @Override
    public Page<CustomerComplaintResponseDTO> getComplaints(Boolean resolved, Pageable pageable) {
        if(resolved == null){
            Page<CustomerComplaint> customerComplaints = complaintRepo.findAll(pageable);
            return customerComplaints.map(complaintMapper::toDto);
        }
        Page<CustomerComplaint> complaints = resolved ?
                complaintRepo.findByResolvedAtNotNull(pageable):
                complaintRepo.findByResolvedAtNull(pageable);
        return complaints.map(complaintMapper::toDto);
    }

    @Override
    @Transactional
    @LogAdminAction(
            action = Action.UPDATE,
            entity = EntityEnum.COMPLAINT,
            entityId = "#id",
            description = "Complaint was resolved by admin"
    )
    public CustomerComplaintResponseDTO resolveComplaint(Long id, ResolveComplaintRequestDTO resolveComplaintRequestDTO, User adminUser) {
        CustomerComplaint complaint = complaintRepo
                .findById(id)
                .orElseThrow(() -> new ComplaintNotFoundException("Complaint not found!"));

        if(complaint.getResolvedAt() != null){
            throw new IllegalStateException("Complaint has already been resolved.");
        }

        complaint.setResolvedBy(adminUser);
        complaint.setResolvedAt(LocalDateTime.now());

        complaint.setBody(complaint.getBody() + "\n\n[Resolution Note]: " + resolveComplaintRequestDTO.resolutionNote());

        CustomerComplaint customerComplaint = complaintRepo.save(complaint);
        return complaintMapper.toDto(customerComplaint);
    }
}