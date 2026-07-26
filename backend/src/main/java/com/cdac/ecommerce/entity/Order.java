package com.cdac.ecommerce.entity;

import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.PaymentMethod;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.util.ArrayList;
import java.util.List;

@Entity
//@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "order_id"))
@Table(name = "orders")
public class Order extends BaseClass {
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "address_id", nullable = false)
        private CustomerAddress address;

        @Enumerated(EnumType.STRING)
        @Column(name = "order_status", nullable = false)
        private OrderStatus orderStatus;

        @Enumerated(EnumType.STRING)
        @Column(name = "payment_method", nullable = false)
        private PaymentMethod paymentMethod;   //  COD, ONLINE

        @Column(name = "total_amt", nullable = false)
        private BigDecimal totalAmt;

        @Column(name = "payment_ref")
        private String paymentRef;   // simulated — just a fake reference string for ONLINE orders

        @Column(name = "tracking_id")
        private String trackingId;

        private LocalDateTime placedAt;
        private LocalDateTime shippedAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime completedAt;

        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<OrderItem> orderItems = new ArrayList<>();


}
