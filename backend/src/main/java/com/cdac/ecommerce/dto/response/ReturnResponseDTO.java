package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.Decision;
import com.cdac.ecommerce.entity.enums.RequestType;
import com.cdac.ecommerce.entity.enums.RefundStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ReturnResponseDTO {

    private Long returnRequestId;

    private Long orderId;

    private Long orderItemId;

    private String productName;

    private String productImage;

    private List<String> imageUrls;

    private Integer quantity;

    private String customerName;

    private RequestType requestType;

    private String reason;

    private Decision sellerDecision;

    private String sellerNotes;

    private LocalDateTime sellerDecidedAt;

    private Decision adminDecision;

    private String adminNotes;

    private LocalDateTime adminDecidedAt;

    private RefundStatus refundStatus;

    private BigDecimal refundAmount;

    private String refundReference;

    private LocalDateTime requestedAt;
}
