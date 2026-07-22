package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    @Query("Update User u set u.active = false where u.id = :id")
    @Modifying
    void softDeleteUser(@Param("id") Long id);

    boolean existsByEmail(String email);

    User findByEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email);

    List<User> findByActiveTrue();

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") Roles role);

    default List<User> findAllCustomers(){
        return findByRole(Roles.CUSTOMER);
    }

    @Query("UPDATE User u SET u.blocked = true WHERE u.id = :customerId")
    @Transactional
    @Modifying
    int blockCustomer(Long customerId);
}
