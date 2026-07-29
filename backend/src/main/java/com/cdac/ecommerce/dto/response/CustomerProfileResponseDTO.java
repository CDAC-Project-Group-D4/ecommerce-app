package com.cdac.ecommerce.dto.response;

public record CustomerProfileResponseDTO(  Long id,

                                           String fullName,

                                           String email,

                                           String phone) {
}
