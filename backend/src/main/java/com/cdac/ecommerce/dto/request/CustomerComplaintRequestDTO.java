package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CustomerComplaintRequestDTO(

    Long orderId,

    @NotNull(message = "customer id can't be null")
    Long customerId,

    @NotBlank(message = "subject can't be empty")
    @Size(max = 255)
    String subject,

    @NotBlank(message = "body can't be empty")
    @Size(max = 500)
    String body
) {
}
