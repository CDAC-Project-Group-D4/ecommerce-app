package com.cdac.ecommerce.dto.request;
import jakarta.persistence.Column;
import lombok.Data;


@Data
public class StoreRequestDTO {
    private String storeName;
    private String description;
    private String bannerUrl = null;
    private String profilePhotoUrl= null;
}
