package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.UserRequestDTO;
import com.cdac.ecommerce.dto.response.UserResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.UserAlreadyExistsException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.UserMapper;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

@Service
@RequiredArgsConstructor // Auto creates a ctor for us
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    @Override
    public UserResponseDTO getUserById(BigInteger id) {

        User user = userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("User not found!"));

        return userMapper.toResponseDTO(user);
    }


    @Override
    @Transactional
    public void deleteUserById(BigInteger id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User doesn't exists"));

        userRepo.softDeleteUser(id);

    }

    @Override
    public UserResponseDTO addUser(@Valid UserRequestDTO user) {
        boolean existingUser = userRepo.existsByEmail(user.email());

        if(!existingUser){
            User newUser = userRepo.save(userMapper.toEntity(user));
            return userMapper.toResponseDTO(newUser);
        }
        else{
            throw new UserAlreadyExistsException("User with this email already exists!");
        }
    }
}
