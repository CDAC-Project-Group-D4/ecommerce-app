package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.Decision;
import com.cdac.ecommerce.entity.enums.RequestType;

import java.time.LocalDateTime;

public record ReturnDisputeResponseDTO(

        Long returnRequestId,
        Long orderId,
        Long orderItemId,
        Long userId,
        String userEmail,
        String reason,
        RequestType requestType,
        Decision sellerDecision,
        String sellerNotes,
        LocalDateTime sellerDecidedAt

) {
}
