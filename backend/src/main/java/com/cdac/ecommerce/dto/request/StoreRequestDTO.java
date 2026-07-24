package com.cdac.ecommerce.dto.request;

import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class StoreRequestDTO {
    private String storeName;
    private String description;
    private Long user_id;
}
