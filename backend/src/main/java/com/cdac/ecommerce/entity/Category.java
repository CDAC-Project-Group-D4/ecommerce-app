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

    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
    List<Product> products=new ArrayList<>();

    private String name;

    private boolean isActive = true;

}
