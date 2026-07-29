package com.cdac.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "review_id"))
@Table(name = "reviews", uniqueConstraints = {
        @UniqueConstraint(
                name = "uq_review",
                columnNames = {"user_id", "product_id", "order_id"}
        )
},
        indexes = {
            @Index(
                    name = "idx_reviews_product_active",
                    columnList = "product_id, is_active"
            )
        })
public class Review extends BaseClass{

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "rating", nullable = false)
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

}
