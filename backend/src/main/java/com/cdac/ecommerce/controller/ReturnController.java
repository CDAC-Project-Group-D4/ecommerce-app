package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.ReturnRequestDTO;
import com.cdac.ecommerce.dto.response.ReturnRequestResponseDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.ReturnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    @PostMapping
    public ResponseEntity<ReturnResponseDTO> create(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ReturnRequestDTO requestDTO) {
        return new ResponseEntity<>(
                returnService.createReturnRequest(userDetails.getId(), requestDTO),
                HttpStatus.CREATED);
    }

    @PostMapping(value = "/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReturnRequestResponseDTO> createRequestWithImage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @ModelAttribute ReturnRequestDTO requestDTO) {

        ReturnRequestResponseDTO returnRequestResponseDTO = returnService.createReturnRequestWithImages(
                requestDTO,
                requestDTO.getImages(),
                userDetails.getUser()
        );

        return ResponseEntity.ok(returnRequestResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<ReturnResponseDTO>> getMyReturns(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(returnService.getMyReturns(userDetails.getId()));
    }

    @GetMapping("/{returnRequestId}")
    public ResponseEntity<ReturnResponseDTO> getById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long returnRequestId) {
        return ResponseEntity.ok(
                returnService.getReturnById(userDetails.getId(), returnRequestId));
    }
}
