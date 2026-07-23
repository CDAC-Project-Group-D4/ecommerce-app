package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.SignInRequestDTO;
import com.cdac.ecommerce.dto.request.SignUpRequestDTO;
import com.cdac.ecommerce.dto.response.SignInResponseDTO;
import com.cdac.ecommerce.dto.response.SignUpResponseDTO;
import com.cdac.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins= "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDTO> signUp(@RequestBody SignUpRequestDTO signUpRequestDTO){
        SignUpResponseDTO signUpResponseDTO= authService.signUp(signUpRequestDTO);
        return ResponseEntity.ok(signUpResponseDTO);
    }

    @PostMapping("/signin")
    public ResponseEntity<SignInResponseDTO> signIn(@RequestBody SignInRequestDTO signInRequestDTO){
        SignInResponseDTO signInResponseDTO= authService.signIn(signInRequestDTO);
        return ResponseEntity.ok(signInResponseDTO);
    }
}
