package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.response.AdminAuditLogsResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface AdminAuditLogService {

    Page<AdminAuditLogsResponseDTO> getAuditLogs(
            Long adminId,
            String entityName,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    void logAction(User admin, Action action, EntityEnum entity, Long entityId, String description);
}
