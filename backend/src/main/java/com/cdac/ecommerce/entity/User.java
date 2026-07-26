package com.cdac.ecommerce.entity;

import com.cdac.ecommerce.entity.enums.Roles;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
@AttributeOverride(name = "userId", column = @Column(name = "id"))
public class User extends BaseClass{

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Set<Roles> roles = new HashSet<>();

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "is_blocked", nullable = false)
    private boolean blocked = false;

    public void addRole(Roles role){
        this.roles.add((role));
    }

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Store store;
}
