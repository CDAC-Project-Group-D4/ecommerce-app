package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    @Transactional
    @Modifying
    @Query("update User u set u.blocked = true where u.id = ?1")
    int blockSeller(Long id);

    @Transactional
    @Modifying
    @Query("update User u set u.blocked = false where u.id = ?1")
    int unblockSeller(Long id);

    @Query("Update User u set u.active = false where u.id = :id")
    @Modifying(clearAutomatically = true)
    int softDeleteUser(@Param("id") Long id);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findByActiveTrue();

    List<User> findByRole(Roles role);

    default List<User> findAllCustomers(){
        return findByRole(Roles.CUSTOMER);
    }

    @Query("UPDATE User u SET u.blocked = true WHERE u.id = :customerId")
    @Transactional
    @Modifying
    int blockCustomer(Long customerId);

    @Query("SELECT u FROM User u JOIN u.store s WHERE u.role = com.cdac.ecommerce.entity.enums.Roles.SELLER AND s.active = true")
    List<User> findAllSellers();
}
