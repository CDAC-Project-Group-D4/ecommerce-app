package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.ResolveComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.service.AdminComplaintsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/complaints")
public class AdminComplaintsController {

    private final AdminComplaintsService adminComplaintsService;

    @GetMapping
    public ResponseEntity<Page<CustomerComplaintResponseDTO>> getAllComplaints(
            @RequestParam(required = false) Boolean resolved,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
            ){

        Page<CustomerComplaintResponseDTO> complaints = adminComplaintsService.getComplaints(resolved, pageable);
        return ResponseEntity.ok(complaints);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<CustomerComplaintResponseDTO> resolveComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ResolveComplaintRequestDTO resolveComplaintRequestDTO,
            @AuthenticationPrincipal User adminUser
            ){

        CustomerComplaintResponseDTO complaintResponseDTO = adminComplaintsService.resolveComplaint(id, resolveComplaintRequestDTO, adminUser);
        return ResponseEntity.ok(complaintResponseDTO);
    }

}
