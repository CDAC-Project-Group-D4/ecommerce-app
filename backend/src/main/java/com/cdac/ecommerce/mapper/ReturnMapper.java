package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.entity.OrderItem;
import com.cdac.ecommerce.entity.ReturnRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReturnMapper {

    public ReturnResponseDTO toDto(ReturnRequest request) {
        ReturnResponseDTO dto = new ReturnResponseDTO();
        OrderItem item = request.getOrderItem();

        dto.setReturnRequestId(request.getId());
        dto.setOrderId(request.getOrder().getId());
        dto.setCustomerName(request.getUser().getFullName());
        dto.setRequestType(request.getRequestType());
        dto.setReason(request.getReason());
        dto.setImageUrls(request.getImages() == null
                ? List.of()
                : request.getImages().stream().map(image -> image.getImageUrl()).toList());
        dto.setSellerDecision(request.getSellerDecision());
        dto.setSellerNotes(request.getSellerNotes());
        dto.setSellerDecidedAt(request.getSellerDecidedAt());
        dto.setAdminDecision(request.getAdminDecision());
        dto.setAdminNotes(request.getAdminNotes());
        dto.setAdminDecidedAt(request.getAdminDecidedAt());
        dto.setRefundStatus(request.getRefundStatus());
        dto.setRefundAmount(request.getRefundAmount());
        dto.setRefundReference(request.getRefundReference());
        dto.setRequestedAt(request.getCreatedAt());

        if (item != null) {
            dto.setOrderItemId(item.getId());
            dto.setProductName(item.getProduct().getName());
            dto.setProductImage(item.getProduct().getImageUrl());
            dto.setQuantity(item.getQuantity());
        }

        return dto;
    }
}
