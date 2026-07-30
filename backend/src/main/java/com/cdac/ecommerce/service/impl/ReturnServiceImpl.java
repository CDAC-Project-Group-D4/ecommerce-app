package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ReturnRequestDTO;
import com.cdac.ecommerce.dto.request.SellerReturnDecisionDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.OrderItem;
import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Decision;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.RefundStatus;
import com.cdac.ecommerce.entity.enums.RequestType;
import com.cdac.ecommerce.exception.ResourceAlreadyExistsException;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.ReturnRequestNotFoundException;
import com.cdac.ecommerce.mapper.ReturnMapper;
import com.cdac.ecommerce.repository.OrderItemRepository;
import com.cdac.ecommerce.repository.OrderRepository;
import com.cdac.ecommerce.repository.ReturnRequestRepo;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReturnServiceImpl implements ReturnService {

    private final ReturnRequestRepo returnRequestRepo;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepo userRepository;
    private final ReturnMapper returnMapper;

    @Override
    public ReturnResponseDTO createReturnRequest(Long userId, ReturnRequestDTO dto) {
        Order order = orderRepository.findByIdAndUser_Id(dto.getOrderId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        if ((order.getOrderStatus() != OrderStatus.DELIVERED
                && order.getOrderStatus() != OrderStatus.COMPLETED)
                || order.getDeliveredAt() == null) {
            throw new IllegalStateException("Return is available only after delivery.");
        }

        LocalDateTime deadline = order.getDeliveredAt().plusDays(7);
        if (LocalDateTime.now().isAfter(deadline)) {
            throw new IllegalStateException("The 7-day return window has closed.");
        }

        OrderItem item = orderItemRepository.findById(dto.getOrderItemId())
                .filter(found -> found.getOrder().getId().equals(order.getId()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "This item does not belong to the selected order."));

        if (returnRequestRepo.existsByOrder_IdAndOrderItem_Id(order.getId(), item.getId())) {
            throw new ResourceAlreadyExistsException(
                    "A return or replacement request already exists for this item.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        ReturnRequest request = new ReturnRequest();
        request.setOrder(order);
        request.setOrderItem(item);
        request.setUser(user);
        request.setRequestType(dto.getRequestType());
        request.setReason(dto.getReason().trim());
        request.setSellerDecision(Decision.PENDING);
        request.setActive(true);

        if (dto.getRequestType() == RequestType.RETURN) {
            request.setRefundStatus(RefundStatus.PENDING);
            request.setRefundAmount(item.getLineTotal());
        } else {
            request.setRefundStatus(RefundStatus.NOT_APPLICABLE);
        }

        return returnMapper.toDto(returnRequestRepo.save(request));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnResponseDTO> getMyReturns(Long userId) {
        return returnRequestRepo.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(ReturnRequest::getActive)
                .map(returnMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReturnResponseDTO getReturnById(Long userId, Long returnRequestId) {
        ReturnRequest request = returnRequestRepo
                .findByIdAndUser_Id(returnRequestId, userId)
                .orElseThrow(() -> new ReturnRequestNotFoundException("Return request not found."));
        return returnMapper.toDto(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnResponseDTO> getSellerReturns(Long sellerId) {
        return returnRequestRepo
                .findByOrderItem_Product_Store_User_IdOrderByCreatedAtDesc(sellerId)
                .stream()
                .filter(ReturnRequest::getActive)
                .map(returnMapper::toDto)
                .toList();
    }

    @Override
    public ReturnResponseDTO decideReturn(
            Long sellerId,
            Long returnRequestId,
            SellerReturnDecisionDTO dto) {

        if (dto.getDecision() == Decision.PENDING) {
            throw new IllegalArgumentException("Choose APPROVED or REJECTED.");
        }

        ReturnRequest request = returnRequestRepo.findById(returnRequestId)
                .filter(found -> found.getOrderItem() != null
                        && found.getOrderItem().getProduct().getStore().getUser().getId().equals(sellerId))
                .orElseThrow(() -> new ReturnRequestNotFoundException("Return request not found."));

        if (request.getSellerDecision() != null
                && request.getSellerDecision() != Decision.PENDING) {
            throw new IllegalStateException("This return request has already been decided.");
        }

        request.setSellerDecision(dto.getDecision());
        request.setSellerNotes(dto.getNotes());
        request.setSellerDecidedAt(LocalDateTime.now());

        if (request.getRequestType() == RequestType.RETURN) {
            if (dto.getDecision() == Decision.APPROVED) {
                request.setRefundStatus(RefundStatus.COMPLETED);
                request.setRefundReference(
                        "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            } else {
                request.setRefundStatus(RefundStatus.REJECTED);
            }
        }

        return returnMapper.toDto(returnRequestRepo.save(request));
    }
}
