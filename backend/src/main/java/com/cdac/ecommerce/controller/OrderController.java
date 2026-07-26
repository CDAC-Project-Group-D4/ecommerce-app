package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.PlaceOrderRequestDTO;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Place Order
    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid PlaceOrderRequestDTO request) {

        OrderResponseDTO response =
                orderService.placeOrder(userDetails.getId(), request);

        return ResponseEntity.ok(response);
    }

    // Get Order History
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        List<OrderResponseDTO> orders =
                orderService.getMyOrders(userDetails.getId());

        return ResponseEntity.ok(orders);
    }

    // Get Order Details
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long orderId) {

        OrderResponseDTO order =
                orderService.getOrderById(userDetails.getId(), orderId);

        return ResponseEntity.ok(order);
    }

    // Cancel Order
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long orderId) {

        orderService.cancelOrder(userDetails.getId(), orderId);

        return ResponseEntity.ok("Order cancelled successfully");
    }
}