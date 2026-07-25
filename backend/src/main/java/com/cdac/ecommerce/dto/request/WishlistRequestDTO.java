package com.cdac.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Used for "add to wishlist". userId comes from the path/authenticated
 * principal, never from this body — same reasoning as CartRequestDTO.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistRequestDTO {

    @NotNull(message = "productId is required")
    private Long productId;
}