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
@ToString
@Table(name = "stores")
@AttributeOverride(name="store_id",column = @Column(name="id"))
public class Store extends BaseClass{

    @OneToMany(mappedBy = "store" ,cascade = CascadeType.ALL,orphanRemoval = true)
    List<Product> productList=new ArrayList<>();
}
