package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.SignInRequestDTO;
import com.cdac.ecommerce.dto.request.SignUpRequestDTO;
import com.cdac.ecommerce.dto.response.SignInResponseDTO;
import com.cdac.ecommerce.dto.response.SignUpResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.UserAlreadyExistsException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.repository.AuthRepository;
import com.cdac.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.control.MappingControl;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final ModelMapper modelMapper;

    @Override
    public SignUpResponseDTO signUp(SignUpRequestDTO signUpRequestDTO) {

        if(authRepository.findByEmail(signUpRequestDTO.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user= modelMapper.map(signUpRequestDTO, User.class);
        User newUser= authRepository.save(user);
        return modelMapper.map(newUser, SignUpResponseDTO.class);
    }

    @Override
    public SignInResponseDTO signIn(SignInRequestDTO signInRequestDTO) {
        User user = authRepository.findByEmail(signInRequestDTO.getEmail()).orElseThrow(()-> new UserNotFoundException("User not found"));

        if(!user.getPassword().equals(signInRequestDTO.getPassword())){
            throw new ResourceNotFoundException("Invalid password");
        }

        SignInResponseDTO responseDTO = modelMapper.map(user, SignInResponseDTO.class);
        responseDTO.setMessage("Login successful");

        return responseDTO;
    }
}
