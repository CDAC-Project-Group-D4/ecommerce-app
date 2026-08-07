package com.cdac.ecommerce.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "products")
@AttributeOverride(name="product_id",column = @Column(name="id"))
public class Product extends BaseClass{

    @Column(name="product_name" ,nullable=false)
    private String name;

    @Column(name = "description",nullable =false)
    private String description;

    @Column(name="price" ,nullable=false)
    private BigDecimal  price;

    @Column(name="stock" ,nullable=false)
    private int stock;

    @Column(name="low_stock_threshold" ,nullable=false)
    private int low_stock_threshold;

    @Column(name="is_active" ,nullable=false)
    private boolean isActive=true;

    @Column(name = "image_url", length = 1000)
    private String imageUrl = null;

    @ManyToOne
    @JoinColumn(name="store_id" ,nullable = false)
    private Store store;

    @ManyToOne
    @JoinColumn(name="category_id" ,nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductAttributeValue> attributeValues = new ArrayList<>();

    public int getLowStockThreshold() {
        return low_stock_threshold;
    }
}
