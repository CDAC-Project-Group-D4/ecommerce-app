package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDTO {

    @NotNull(message = "Product Id is required")
    private Long productId;

    @NotNull(message = "Order Id is required")
    private Long orderId;

    @NotNull(message = "Rating is required")
    @Min(value = 1)
    @Max(value = 5)
    private Integer rating;

    @Size(max = 1000)
    private String comment;
}