package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    @Query("Update User u set u.active = false where u.id = :id")
    @Modifying
    void softDeleteUser(@Param("id") Long id);

    boolean existsByEmail(String email);

    User findByEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email);

    List<User> findByActiveTrue();
}
