package com.cdac.ecommerce.entity;

import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "admin_audit_logs", indexes = @Index(name = "idx_audit_admin", columnList = "admin_user_id"))
public class AdminAuditLog extends BaseClass{

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_user_id", nullable = false)
    private User adminUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private Action action;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity", nullable = false)
    private EntityEnum entity;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "performed_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime performedAt;

}
