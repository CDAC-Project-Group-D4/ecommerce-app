package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ResolveComplaintRequestDTO(

        @NotBlank(message = "Resolution not is required")
        String resolutionNote
) {
}
