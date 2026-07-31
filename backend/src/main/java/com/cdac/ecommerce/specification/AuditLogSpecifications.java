package com.cdac.ecommerce.specification;

import com.cdac.ecommerce.entity.AdminAuditLog;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class AuditLogSpecifications {

    public static Specification<AdminAuditLog> hasAdminId(Long adminId){
        return ((root, query, criteriaBuilder) ->
                adminId == null ? null : criteriaBuilder.equal(root.get("adminUser").get("id"), adminId));
    }

    public static Specification<AdminAuditLog> hasEntityName(String entityName){
        return ((root, query, criteriaBuilder) ->
                entityName == null || entityName.isBlank() ? null :
                        criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("entityName")), entityName.toLowerCase()));
    }

    public static Specification<AdminAuditLog> createdBetween(LocalDateTime startDate, LocalDateTime endDate){
        return (root, query, criteriaBuilder) -> {
            if(startDate != null && endDate != null){
                return criteriaBuilder.between(root.get("createdAt"), startDate, endDate);
            } else if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            } else if (endDate != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("createdAt"), endDate);
            }
            return null;
        };
    }

}
