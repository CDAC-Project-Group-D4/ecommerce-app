package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class StoreResponseDTO {
    private String storeName;
    private String description;
    private String bannerUrl;
    private String profilePhotoUrl;
    private boolean onHoliday;
    private boolean active;
}
