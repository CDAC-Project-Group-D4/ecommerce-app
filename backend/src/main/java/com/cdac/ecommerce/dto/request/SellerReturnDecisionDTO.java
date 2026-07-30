package com.cdac.ecommerce.dto.request;

import com.cdac.ecommerce.entity.enums.Decision;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerReturnDecisionDTO {

    @NotNull(message = "Decision is required")
    private Decision decision;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
