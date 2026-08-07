package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ChangePasswordRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerProfileRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerProfileResponseDTO;
import com.cdac.ecommerce.entity.CustomerAddress;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.mapper.CustomerAddressMapper;
import com.cdac.ecommerce.repository.CustomerAddressRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.CustomerAddressService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerAddressServiceImpl implements CustomerAddressService {

    private final CustomerAddressRepository customerAddressRepository;
    private final UserRepo userRepository;
    private final CustomerAddressMapper customerAddressMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Helper method to extract current authenticated user from Spring Security context
     */
    private User getCurrentAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfileResponseDTO getProfile(Long id) {
        User user = getCurrentAuthenticatedUser();
        return new CustomerProfileResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    @Override
    public CustomerProfileResponseDTO updateProfile(CustomerProfileRequestDTO requestDTO) {
        User user = getCurrentAuthenticatedUser();

        user.setFullName(requestDTO.fullName());
        user.setPhone(requestDTO.phone());

        User saved = userRepository.save(user);

        return new CustomerProfileResponseDTO(
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getPhone()
        );
    }

    @Override
    public void changePassword(ChangePasswordRequestDTO requestDTO) {
        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(requestDTO.oldPassword(), user.getPassword())) {
            throw new RuntimeException("Old Password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(requestDTO.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerAddressResponseDTO> getAllAddress() {
        User user = getCurrentAuthenticatedUser();

        // 🔑 Fetch ONLY active addresses for the user
        return customerAddressRepository.findByUserAndActiveTrue(user)
                .stream()
                .map(customerAddressMapper::toResponseDto)
                .toList();
    }

    @Override
    public CustomerAddressResponseDTO addAddress(CustomerAddressRequestDTO requestDTO) {
        User user = getCurrentAuthenticatedUser();

        CustomerAddress address = customerAddressMapper.toEntity(requestDTO);
        address.setUser(user);
        address.setActive(true); // Ensure new address is active by default

        CustomerAddress saved = customerAddressRepository.save(address);

        return customerAddressMapper.toResponseDto(saved);
    }

    @Override
    public CustomerAddressResponseDTO updateAddress(Long id, CustomerAddressRequestDTO requestDTO) {
        User user = getCurrentAuthenticatedUser();

        // Ensure user owns this address before updating
        CustomerAddress address = customerAddressRepository.findByIdAndUserAndActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Address not found or unauthorized"));

        customerAddressMapper.updateEntity(address, requestDTO);

        CustomerAddress updated = customerAddressRepository.save(address);

        return customerAddressMapper.toResponseDto(updated);
    }

    @Override
    public String deleteAddress(Long id) {
        User user = getCurrentAuthenticatedUser();

        // Ensure user owns this address before soft-deleting
        CustomerAddress address = customerAddressRepository.findByIdAndUserAndActiveTrue(id, user)
                .orElseThrow(() -> new RuntimeException("Address not found or unauthorized"));

        address.setActive(false);
        customerAddressRepository.save(address);

        return "Address deleted successfully";
    }
}