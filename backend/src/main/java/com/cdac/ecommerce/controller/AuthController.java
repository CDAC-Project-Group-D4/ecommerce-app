package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.SignInRequestDTO;
import com.cdac.ecommerce.dto.request.SignUpRequestDTO;
import com.cdac.ecommerce.dto.response.SignInResponseDTO;
import com.cdac.ecommerce.dto.response.SignUpResponseDTO;
import com.cdac.ecommerce.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDTO> signUp(
            @Valid @RequestBody SignUpRequestDTO signUpRequestDTO) {

        SignUpResponseDTO signUpResponseDTO = authService.signUp(signUpRequestDTO);
        return ResponseEntity.ok(signUpResponseDTO);
    }

    @PostMapping("/signin")
    public ResponseEntity<SignInResponseDTO> signIn(
            @Valid @RequestBody SignInRequestDTO signInRequestDTO) {

        SignInResponseDTO signInResponseDTO = authService.signIn(signInRequestDTO);

        ResponseCookie cookie = ResponseCookie.from("jwtToken", signInResponseDTO.getJwtToken() != null ? signInResponseDTO.getJwtToken() : "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(signInResponseDTO);
    }

    @PostMapping("/signout")
    public ResponseEntity<String> signOut() {
        ResponseCookie cookie = ResponseCookie.from("jwtToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Signed out successfully");
    }
}