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

    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
    List<Product> products=new ArrayList<>();
}
