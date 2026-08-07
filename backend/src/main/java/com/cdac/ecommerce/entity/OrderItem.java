package com.cdac.ecommerce.entity;

import com.cdac.ecommerce.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "order_item_id"))
@Table(name = "order_items")
public class OrderItem extends BaseClass {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "line_total", nullable = false)
    private BigDecimal lineTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false)
    private OrderStatus itemStatus = OrderStatus.CONFIRMED;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
}
