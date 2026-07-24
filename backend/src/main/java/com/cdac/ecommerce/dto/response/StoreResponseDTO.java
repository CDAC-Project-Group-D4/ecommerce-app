package com.cdac.ecommerce.dto.response;

import lombok.Data;

@Data
public class StoreResponseDTO {
    private String storeName;
    private String description;
    private String bannerUrl;
    private String profilePhotoUrl;
    private boolean onHoliday;
    private boolean active;
}
