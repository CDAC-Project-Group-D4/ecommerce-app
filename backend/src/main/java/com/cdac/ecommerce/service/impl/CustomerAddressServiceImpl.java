package com.cdac.ecommerce.service.impl;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.dto.request.ChangePasswordRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.request.CustomerProfileRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerProfileResponseDTO;
import com.cdac.ecommerce.entity.CustomerAddress;
import com.cdac.ecommerce.mapper.CustomerAddressMapper;
import com.cdac.ecommerce.repository.CustomerAddressRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.CustomerAddressService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerAddressServiceImpl implements CustomerAddressService {


    private final CustomerAddressRepository customerAddressRepository;
    private final UserRepo userRepository;
    private final CustomerAddressMapper customerAddressMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public CustomerProfileResponseDTO getProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        CustomerProfileResponseDTO dto = new CustomerProfileResponseDTO();

        return new CustomerProfileResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    @Override
    public CustomerProfileResponseDTO updateProfile(CustomerProfileRequestDTO requestDTO) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(requestDTO.oldPassword(), user.getPassword())) {
            throw new RuntimeException("Old Password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(requestDTO.newPassword()));

        userRepository.save(user);
    }

    @Override
    public List<CustomerAddressResponseDTO> getAllAddress() {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return customerAddressRepository.findByUser(user)
                .stream()
                .map(customerAddressMapper::toResponseDto)
                .toList();
    }

    @Override
    public CustomerAddressResponseDTO addAddress(CustomerAddressRequestDTO requestDTO) {
        User user = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerAddress address = customerAddressMapper.toEntity(requestDTO);

        address.setUser(user);

        CustomerAddress saved = customerAddressRepository.save(address);

        return customerAddressMapper.toResponseDto(saved);
    }

    @Override
    public CustomerAddressResponseDTO updateAddress(Long id, CustomerAddressRequestDTO requestDTO) {
        CustomerAddress address = customerAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setFullName(requestDTO.fullName());
        address.setMobileNumber(requestDTO.mobileNumber());
        address.setLabel(requestDTO.label());
        address.setAddressLine1(requestDTO.addressLine1());
        address.setAddressLine2(requestDTO.addressLine2());
        address.setPincode(requestDTO.pincode());
        address.setCity(requestDTO.city());
        address.setState(requestDTO.state());
        address.setCountry(requestDTO.country());

        CustomerAddress updated = customerAddressRepository.save(address);

        return customerAddressMapper.toResponseDto(updated);
    }

    @Override
    public String deleteAddress(Long id) {
        CustomerAddress address = customerAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setActive(false);

        customerAddressRepository.save(address);

        return "Address deleted successfully";
    }

}
