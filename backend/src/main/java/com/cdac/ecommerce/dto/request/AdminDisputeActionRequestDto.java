package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminDisputeActionRequestDto(
        @NotNull(message = "Admin id can't be left blank")
        Long adminId,

        @NotBlank(message = "admin notes are required!")
        String adminNotes
) {
}
