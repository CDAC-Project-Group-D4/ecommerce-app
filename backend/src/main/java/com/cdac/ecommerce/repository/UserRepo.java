package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;

@Repository
public interface UserRepo extends JpaRepository<User, BigInteger> {

    @Query("Update User u set u.active = false where u.id = :id")
    @Modifying
    void softDeleteUser(@Param("id") BigInteger id);

    boolean existsByEmail(String email);
}
