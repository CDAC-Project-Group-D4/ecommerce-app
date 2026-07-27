package com.cdac.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "categories")
@AttributeOverride(name="category_id",column = @Column(name="id"))
public class Category extends BaseClass{

    @Column(name="category_name", nullable = false, unique = true)
    private String name;

    @Column(name="is_active", nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category parent;

    //self - referencing
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Category> subCategories = new ArrayList<>();

    @OneToMany(mappedBy = "category")
    private List<Product> products = new ArrayList<>();

}
