package com.cdac.ecommerce.dto.request;

import com.cdac.ecommerce.entity.enums.RequestType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class ReturnRequestDTO {

    @NotNull(message = "Order Id is required")
    private Long orderId;

    @NotNull(message = "Order Item Id is required")
    private Long orderItemId;

    @NotNull(message = "Request Type is required")
    private RequestType requestType;

    @NotBlank(message = "Reason is required")
    private String reason;

    private List<MultipartFile> images;
}