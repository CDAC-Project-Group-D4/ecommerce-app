package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ReturnRequestDTO;
import com.cdac.ecommerce.dto.request.SellerReturnDecisionDTO;
import com.cdac.ecommerce.dto.response.ReturnRequestResponseDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.entity.*;
import com.cdac.ecommerce.entity.enums.Decision;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.RefundStatus;
import com.cdac.ecommerce.entity.enums.RequestType;
import com.cdac.ecommerce.exception.OrderNotFoundException;
import com.cdac.ecommerce.exception.ResourceAlreadyExistsException;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.ReturnRequestNotFoundException;
import com.cdac.ecommerce.mapper.ReturnMapper;
import com.cdac.ecommerce.repository.*;
import com.cdac.ecommerce.service.FileStorageService;
import com.cdac.ecommerce.service.ReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final FileStorageService fileStorageService;
    private final ReturnRequestImageRepository returnRequestImageRepository;
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

    @Override
    @Transactional
    public ReturnRequestResponseDTO createReturnRequestWithImages(
            ReturnRequestDTO requestDTO,
            List<MultipartFile> images,
            User user) {


        Order order = orderRepository.findById(requestDTO.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException("Order doesn't exists with id: " + requestDTO.getOrderId()));

        OrderItem orderItem = orderItemRepository.findById(requestDTO.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + requestDTO.getOrderItemId()));

        ReturnRequest request = new ReturnRequest();
        request.setUser(user);
        request.setRequestType(requestDTO.getRequestType());
        request.setOrder(order);
        request.setOrderItem(orderItem);
        request.setReason(requestDTO.getReason());

        ReturnRequest savedRequest = returnRequestRepo.save(request);

        if(images != null && !images.isEmpty()){
            List<String> imageUrls = fileStorageService.uploadMultipleFiles(images, "return-images");

            List<ReturnRequestImage> returnRequestImages = imageUrls.stream().map(url ->
                    ReturnRequestImage.builder()
                            .returnRequest(savedRequest)
                            .imageUrl(url)
                            .build()).toList();

            List<ReturnRequestImage> savedImages = returnRequestImageRepository.saveAll(returnRequestImages);

            savedRequest.setImages(savedImages);
        }

        return returnMapper.toDtoWithImage(savedRequest);
    }
}
