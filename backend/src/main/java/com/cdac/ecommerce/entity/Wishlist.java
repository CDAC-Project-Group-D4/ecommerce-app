package com.cdac.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(
        name = "wishlists",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_wishlist_user_product", columnNames = {"user_id", "product_id"})
        }
)
@Getter
@Setter
public class Wishlist extends BaseClass {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
