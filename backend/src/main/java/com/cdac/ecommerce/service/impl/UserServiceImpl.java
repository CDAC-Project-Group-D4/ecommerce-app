package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ChangePasswordDTO;
import com.cdac.ecommerce.dto.request.UserRequestDTO;
import com.cdac.ecommerce.dto.response.UserResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.UserAlreadyExistsException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.UserMapper;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // Auto creates a ctor for us
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepo.findByActiveTrue()
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("User not found!"));

        return userMapper.toResponseDTO(user);
    }


    @Override
    @Transactional
    public void deleteUserById(Long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User doesn't exists"));

        userRepo.softDeleteUser(id);

    }

    @Override
    public UserResponseDTO addUser(@Valid UserRequestDTO user) {
        boolean existingUser = userRepo.existsByEmail(user.email());

        if(!existingUser){
            User savedUser = userRepo.save(userMapper.toEntity(user));
            return userMapper.toResponseDTO(savedUser);
        }
        else{
            throw new UserAlreadyExistsException("User with this email already exists!");
        }
    }

    @Override
    @Transactional(readOnly = true) // Hibernate session open rakhta hai
    public UserResponseDTO getLoggedInUserProfile(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // BaseClass se id aur createdAt safely handle kar rahe hain
        Long id = user.getId(); 
        LocalDateTime created = (user.getCreatedAt() != null) ? user.getCreatedAt() : LocalDateTime.now();

        return new UserResponseDTO(
                id,
                user.getFullName(),
                user.getEmail(),
                user.getImageUrl(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                created
        );
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordDTO dto) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Incorrect current password!");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepo.save(user);
    }
}
