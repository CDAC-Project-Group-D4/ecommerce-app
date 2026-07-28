package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders(){

        return new ResponseEntity<>(adminOrderService.getAllOrders(), HttpStatus.OK);
    }

    @PatchMapping("/{id}/out-for-delivery")
    public ResponseEntity<Void> simulateOutForDelivery(@PathVariable Long id){

        boolean outForDelivery = adminOrderService.simulateOutForDelivery(id);

        if(outForDelivery){
            return ResponseEntity.noContent().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }

    }

    @PatchMapping("/{id}/delivered")
    public ResponseEntity<Void> simulateDelivered(@PathVariable Long id){

        boolean delivered = adminOrderService.simulateDelivered(id);

        if(delivered){
            return ResponseEntity.noContent().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }

    }
}
