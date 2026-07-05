package com.cdac.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@AttributeOverride(name = "complaint_id", column = @Column(name = "id"))
@Table(name = "customer_complaints")
public class CustomerComplaint extends BaseClass{

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, length = 500)
    private String body;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "is_active")
    private boolean isActive = true;
}
