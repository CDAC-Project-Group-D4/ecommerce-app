package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.UserRequestDTO;
import com.cdac.ecommerce.dto.response.UserResponseDTO;
import jakarta.validation.Valid;

import java.math.BigInteger;
import java.util.List;

public interface UserService {


    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(BigInteger id);

    void deleteUserById(BigInteger id);

    UserResponseDTO addUser(@Valid UserRequestDTO user);
}
