package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.CustomerAddress;
import com.cdac.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    List<CustomerAddress> findByUser(User user);
    List<CustomerAddress> findByUser_Id(Long userId);

    List<CustomerAddress> findByUserAndActiveTrue(User user);

    Optional<CustomerAddress> findByIdAndUserAndActiveTrue(Long id, User user);

    List<CustomerAddress> findByUser_IdAndActiveTrue(Long userId);

    Optional<CustomerAddress> findByIdAndUser_Id(Long addressId, Long userId);
}