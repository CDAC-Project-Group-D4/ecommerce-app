package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.AdminAuditLogsResponseDTO;
import com.cdac.ecommerce.entity.AdminAuditLog;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import com.cdac.ecommerce.mapper.AdminAuditMapper;
import com.cdac.ecommerce.repository.AdminLogRepository;
import com.cdac.ecommerce.service.AdminAuditLogService;
import com.cdac.ecommerce.specification.AuditLogSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class AdminAuditLogServiceImpl implements AdminAuditLogService {

    private final AdminLogRepository adminLogRepository;
    private final AdminAuditMapper adminAuditMapper;

    @Override
    public Page<AdminAuditLogsResponseDTO> getAuditLogs(
            Long adminId,
            String entityName,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        Specification<AdminAuditLog> specification = Specification.unrestricted();

        specification = specification
                .and(AuditLogSpecifications.hasAdminId(adminId))
                .and(AuditLogSpecifications.hasEntityName(entityName))
                .and(AuditLogSpecifications.createdBetween(startDate, endDate));

        return adminLogRepository.findAll(specification, pageable)
                .map(adminAuditMapper::toDTO);

    }

    @Override
    @Transactional
    public void logAction(User admin, Action action, EntityEnum entity, Long entityId, String description) {
        AdminAuditLog log = new AdminAuditLog();

        log.setAdminUser(admin);
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setDescription(description);

        adminLogRepository.save(log);
    }
}
