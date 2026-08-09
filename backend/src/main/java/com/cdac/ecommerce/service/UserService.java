package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.ChangePasswordDTO;
import com.cdac.ecommerce.dto.request.UserRequestDTO;
import com.cdac.ecommerce.dto.response.UserResponseDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {


    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    void deleteUserById(Long id);

    UserResponseDTO addUser(@Valid UserRequestDTO user);

    
    UserResponseDTO getLoggedInUserProfile(String email);

   
    void changePassword(String email, ChangePasswordDTO dto);
}
