// MODIFIED: Package updated for e-commerce project
package com.cdac.ecommerce.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.cdac.ecommerce.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    @JsonIgnore
    private User user;
    // MODIFIED: Changed Integer to Long to match BaseClass id
    private Long id;
    private String name;
    private String email;

    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    // MODIFIED: Changed constructor parameter id from Integer to Long
    public UserDetailsImpl(Long id, String name, String email, String password,
        Collection<? extends GrantedAuthority> authorities){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user){

        String roleName = user.getRole() != null ? user.getRole().name() : "";

        if (!roleName.isEmpty() && !roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        List<GrantedAuthority> authorities = user.getRole() != null ?
                List.of(new SimpleGrantedAuthority(roleName)) :
                List.of();

        UserDetailsImpl userDetails = new UserDetailsImpl(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );
        userDetails.setUser(user);
        return userDetails;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // MODIFIED: Check blocked status from User entity
        return user == null || !user.isBlocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // MODIFIED: Check active status from User entity
        return user == null || user.isActive();
    }
}
