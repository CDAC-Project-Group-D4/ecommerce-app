package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CustomerResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.CustomerMapper;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.AdminCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCustomerServiceImpl implements AdminCustomerService {

    private final UserRepo userRepo;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDTO> getAllCustomers() {

        List<CustomerResponseDTO> customers = userRepo.findAllCustomers().stream().map(customerMapper::toDto).collect(Collectors.toList());

        return customers;
    }

    @Override
    @Transactional
    public boolean deleteCustomer(Long customerId) {

        User customer = userRepo.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean isDeleted = !customer.isActive();

        if(!isDeleted){
            userRepo.softDeleteUser(customerId);
            return true;
        }

        return false;
    }

    @Override
    public boolean blockCustomer(Long customerId) {

        User customer = userRepo.findById(customerId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean isBlocked = customer.isBlocked();

        if(!isBlocked){
            int usersUpdated = userRepo.blockCustomer(customerId);
            return usersUpdated > 0 ? true : false;
        }

        return false;
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long customerId) {

        User customer = userRepo.findById(customerId)
                .orElseThrow(()-> new UserNotFoundException("User doesn't exist"));

        CustomerResponseDTO customerResponseDTO = customerMapper.toDto(customer);

        return customerResponseDTO;
    }
}
