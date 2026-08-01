package com.cdac.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "seller_commission_overrides")
public class SellerCommissionOverride extends BaseClass{

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_user_id", nullable = false, unique = true)
    private User seller;

    @Column(name = "commissionPercentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionPercentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "set_by_user_id", nullable = false)
    private User setBy;

}
