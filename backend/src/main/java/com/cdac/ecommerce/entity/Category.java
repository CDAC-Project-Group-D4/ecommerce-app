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
//@ToString
@Table(name = "categories")
@AttributeOverride(name="category_id",column = @Column(name="id"))
public class Category extends BaseClass{


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

//    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)

    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL , orphanRemoval = true)

    List<Product> products=new ArrayList<>();

    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;


}
