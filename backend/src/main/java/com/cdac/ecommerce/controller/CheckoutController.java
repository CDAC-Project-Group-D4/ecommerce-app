package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.dto.response.CheckoutResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.CheckoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @GetMapping
    public ResponseEntity<CheckoutResponseDTO> getCheckout(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Long userId = userDetails.getId();

        CheckoutResponseDTO response = checkoutService.getCheckout(userId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/addresses")
    public ResponseEntity<CustomerAddressResponseDTO> addAddress(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid CustomerAddressRequestDTO request) {

        CustomerAddressResponseDTO response =
                checkoutService.addAddress(userDetails.getId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
