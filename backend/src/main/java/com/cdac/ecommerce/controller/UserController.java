package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.UserRequestDTO;
import com.cdac.ecommerce.dto.response.UserResponseDTO;
import com.cdac.ecommerce.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.math.BigInteger;
import java.security.Principal;
import java.util.List;

import com.cdac.ecommerce.dto.request.ChangePasswordDTO;
import jakarta.validation.Valid; // @Valid ke liye

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers(){
        List<UserResponseDTO> users =  userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id){
        UserResponseDTO dto = userService.getUserById(id);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id){
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> addUser(@RequestBody @Valid UserRequestDTO user){
        UserResponseDTO newUser = userService.addUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    // Change Password Endpoint
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Principal principal, 
            @Valid @RequestBody ChangePasswordDTO dto) {
            
        userService.changePassword(principal.getName(), dto);
        return ResponseEntity.ok("Password changed successfully!");
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMyProfile(Principal principal) {
    if (principal == null || principal.getName() == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    return ResponseEntity.ok(userService.getLoggedInUserProfile(principal.getName()));
}
}
