package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.SignInRequestDTO;
import com.cdac.ecommerce.dto.request.SignUpRequestDTO;
import com.cdac.ecommerce.dto.response.SignInResponseDTO;
import com.cdac.ecommerce.dto.response.SignUpResponseDTO;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import com.cdac.ecommerce.exception.UserAlreadyExistsException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.repository.AuthRepository;
import com.cdac.ecommerce.security.JwtUtils;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final ModelMapper modelMapper;
    // MODIFIED: Injected Security components
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    public SignUpResponseDTO signUp(SignUpRequestDTO signUpRequestDTO) {

        if (authRepository.findByEmail(signUpRequestDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = modelMapper.map(signUpRequestDTO, User.class);
        user.setPassword(passwordEncoder.encode(signUpRequestDTO.getPassword()));

        if (user.getRole() == null){
            user.setRole(Roles.CUSTOMER);
        }

        user.setActive(true);
        user.setBlocked(false);

        User newUser = authRepository.save(user);

        SignUpResponseDTO responseDTO = modelMapper.map(newUser, SignUpResponseDTO.class);
        responseDTO.setUserId(newUser.getId());

        return responseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public SignInResponseDTO signIn(SignInRequestDTO signInRequestDTO) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signInRequestDTO.getEmail(),
                        signInRequestDTO.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        User user = userDetails.getUser();

        SignInResponseDTO responseDTO = modelMapper.map(user, SignInResponseDTO.class);
        responseDTO.setUserId(user.getId());
        responseDTO.setMessage("Login successful");
        responseDTO.setJwtToken(jwtToken);

        return responseDTO;
    }
}