package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.AdminAuditLogsResponseDTO;
import com.cdac.ecommerce.service.AdminAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/audit-logs")
public class AdminAuditLogController {

    private final AdminAuditLogService adminAuditLogService;

    @GetMapping
    public ResponseEntity<Page<AdminAuditLogsResponseDTO>> getAuditLogs(
            @RequestParam(name = "adminId", required = false) Long adminId,
            @RequestParam(name = "entityName", required = false) String entityName,
            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
            ){

        Page<AdminAuditLogsResponseDTO> auditLogsResponseDTOS = adminAuditLogService.getAuditLogs(
                adminId, entityName, startDate, endDate, pageable
        );

        return ResponseEntity.ok(auditLogsResponseDTOS);
    }

}
