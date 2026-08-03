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
@Table(name = "users", uniqueConstraints = {
            @UniqueConstraint(name = "uk_users_email", columnNames = "email")
        }
)
@AttributeOverride(name = "userId", column = @Column(name = "id"))
public class User extends BaseClass{

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "roles", nullable = false)
    private Roles role;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "is_blocked", nullable = false)
    private boolean blocked = false;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Store store;
}
