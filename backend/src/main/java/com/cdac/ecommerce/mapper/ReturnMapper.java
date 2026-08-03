package com.cdac.ecommerce.mapper;

import com.cdac.ecommerce.dto.response.ReturnRequestImageResponseDTO;
import com.cdac.ecommerce.dto.response.ReturnRequestResponseDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.entity.OrderItem;
import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.ReturnRequestImage;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
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

    public ReturnRequestResponseDTO toDtoWithImage(ReturnRequest request){

        if(request == null){
            return null;
        }

        List<ReturnRequestImageResponseDTO> imageResponseDTOList = request.getImages() != null
                ? request.getImages().stream()
                .map(this::toImageDto)
                .toList()
                : Collections.emptyList();

        return ReturnRequestResponseDTO.builder()
                .id(request.getId())
                .orderId(request.getOrder() != null ? request.getOrder().getId() : null)
                .orderItemId(request.getOrderItem() != null ? request.getOrderItem().getId() : null)
                .requestType(request.getRequestType() != null ? request.getRequestType().name() : null)
                .sellerDecision(request.getSellerDecision() != null ? request.getSellerDecision().name() : null)
                .adminDecision(request.getAdminDecision() != null ? request.getAdminDecision().name() : null)
                .images(imageResponseDTOList)
                .createdAt(request.getCreatedAt())
                .build();

    }

    public ReturnRequestImageResponseDTO toImageDto(ReturnRequestImage image){
        if(image == null){
            return null;
        }

        return ReturnRequestImageResponseDTO.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .createdAt(image.getCreatedAt())
                .build();
    }
}
