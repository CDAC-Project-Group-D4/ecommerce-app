package com.cdac.ecommerce.entity;

import com.cdac.ecommerce.entity.enums.RequestType;
import com.cdac.ecommerce.entity.enums.Decision;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@AttributeOverride(name = "id", column = @Column(name = "return_request_id"))
@Table(name = "return_requests")
public class ReturnRequest extends BaseClass {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "request_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestType requestType;

    @Column(name = "seller_decision")
    @Enumerated(EnumType.STRING)
    private Decision sellerDecision;

    @Column(name = "seller_notes", columnDefinition = "TEXT")
    private String sellerNotes;

    @Column(name = "seller_decided_at")
    private LocalDateTime sellerDecidedAt;

    @JoinColumn(name = "admin_user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User adminUserId;

    @Column(name = "admin_decision")
    @Enumerated(EnumType.STRING)
    private Decision adminDecision;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String  adminNotes;

    @Column(name = "admin_decided_at")
    private LocalDateTime adminDecidedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;
}
