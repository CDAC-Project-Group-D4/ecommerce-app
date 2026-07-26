package com.cdac.ecommerce.dto.response;

import lombok.Data;

@Data
public class StoreResponseDTO {
    private Long id;
    private String storeName;
    private String description;
    private String bannerUrl;
    private String profilePhotoUrl;
    private boolean onHoliday;
    private boolean active;
    private String message;
    private Long userId;
}
