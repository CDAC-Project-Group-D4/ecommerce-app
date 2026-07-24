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

    @Column(name="store_name", nullable = false)
    private String storeName;

    private String description;

    @Column(name="banner_url")
    private String bannerUrl;

    @Column(name="profile_photo_url")
    private String profilePhotoUrl;

    @Column(name="on_holiday", nullable = false)
    private boolean onHoliday= false;

    @Column(name = "is_active", nullable = false)
    private boolean active= true;

    @OneToMany(mappedBy = "store" ,cascade = CascadeType.ALL,orphanRemoval = true)
    List<Product> productList=new ArrayList<>();

    @OneToOne
    @JoinColumn(name= "user_id", nullable = false, unique = true)
    private User user;
}
