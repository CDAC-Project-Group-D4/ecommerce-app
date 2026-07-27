package com.cdac.ecommerce.dto.request;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class StoreRequestDTO {

    @NotBlank(message = "store name is required")
    private String storeName;

    @NotBlank(message = "description is required")
    private String description;
    private String bannerUrl = null;
    private String profilePhotoUrl= null;
}
