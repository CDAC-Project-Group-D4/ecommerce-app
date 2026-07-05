package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.CustomerComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerComplaintRepo extends JpaRepository<CustomerComplaint, Long> {

    @Query("select c from CustomerComplaint c where c.customer.id = ?1")
    List<CustomerComplaint> findByCustomer_Id(Long id);
}
