package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ReturnRequestDTO;
import com.cdac.ecommerce.dto.request.SellerReturnDecisionDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.OrderItem;
import com.cdac.ecommerce.entity.ReturnRequest;
import com.cdac.ecommerce.entity.ReturnRequestImage;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReturnServiceImpl implements ReturnService {

    private static final int MIN_IMAGES = 1;
    private static final int MAX_IMAGES = 5;
    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024;
    private static final Path RETURN_UPLOAD_DIR = Paths.get("uploads", "returns");
    private static final Map<String, String> ALLOWED_IMAGE_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final ReturnRequestRepo returnRequestRepo;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepo userRepository;
    private final ReturnMapper returnMapper;

    @Override
    public ReturnResponseDTO createReturnRequest(
            Long userId, ReturnRequestDTO dto, List<MultipartFile> images) {
        validateImages(images);

        Order order = orderRepository.findByIdAndUser_Id(dto.getOrderId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found."));

        OrderItem item = orderItemRepository.findById(dto.getOrderItemId())
                .filter(found -> found.getOrder().getId().equals(order.getId()))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "This item does not belong to the selected order."));

        if ((item.getItemStatus() != OrderStatus.DELIVERED
                && item.getItemStatus() != OrderStatus.COMPLETED)
                || item.getDeliveredAt() == null) {
            throw new IllegalStateException("Return is available only after this item is delivered.");
        }

        LocalDateTime deadline = item.getDeliveredAt().plusDays(7);
        if (LocalDateTime.now().isAfter(deadline)) {
            throw new IllegalStateException("The 7-day return window has closed for this item.");
        }

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

        List<Path> savedFiles = new ArrayList<>();
        try {
            Files.createDirectories(RETURN_UPLOAD_DIR);
            for (MultipartFile image : images) {
                String contentType = image.getContentType().toLowerCase();
                String filename = UUID.randomUUID() + ALLOWED_IMAGE_TYPES.get(contentType);
                Path destination = RETURN_UPLOAD_DIR.resolve(filename).normalize();
                if (!destination.startsWith(RETURN_UPLOAD_DIR.normalize())) {
                    throw new IllegalArgumentException("Invalid image filename.");
                }
                Files.copy(image.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
                savedFiles.add(destination);

                ReturnRequestImage requestImage = new ReturnRequestImage();
                requestImage.setReturnRequest(request);
                requestImage.setImageUrl("/uploads/returns/" + filename);
                requestImage.setOriginalFilename(image.getOriginalFilename());
                requestImage.setContentType(contentType);
                requestImage.setFileSize(image.getSize());
                request.getImages().add(requestImage);
            }
        } catch (IOException exception) {
            savedFiles.forEach(this::deleteQuietly);
            throw new IllegalStateException("Unable to save return images.", exception);
        }

        if (dto.getRequestType() == RequestType.RETURN) {
            request.setRefundStatus(RefundStatus.PENDING);
            request.setRefundAmount(item.getLineTotal());
        } else {
            request.setRefundStatus(RefundStatus.NOT_APPLICABLE);
        }

        try {
            return returnMapper.toDto(returnRequestRepo.save(request));
        } catch (RuntimeException exception) {
            savedFiles.forEach(this::deleteQuietly);
            throw exception;
        }
    }

    private void validateImages(List<MultipartFile> images) {
        if (images == null || images.size() < MIN_IMAGES) {
            throw new IllegalArgumentException("At least 1 product image is required.");
        }
        if (images.size() > MAX_IMAGES) {
            throw new IllegalArgumentException("A maximum of 5 product images is allowed.");
        }
        for (MultipartFile image : images) {
            if (image == null || image.isEmpty()) {
                throw new IllegalArgumentException("Product images cannot be empty.");
            }
            if (image.getSize() > MAX_IMAGE_SIZE) {
                throw new IllegalArgumentException("Each image must be 5 MB or smaller.");
            }
            String contentType = image.getContentType();
            if (contentType == null || !ALLOWED_IMAGE_TYPES.containsKey(contentType.toLowerCase())) {
                throw new IllegalArgumentException("Only JPG, PNG, and WebP images are allowed.");
            }
        }
    }

    private void deleteQuietly(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
            // Best-effort cleanup after a failed request.
        }
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
