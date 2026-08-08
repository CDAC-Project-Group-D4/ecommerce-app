package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.dto.response.OrderItemResponseDTO;
import java.util.List;
import java.util.Map;

public interface StoreService {

    StoreResponseDTO createStore(StoreRequestDTO storeRequestDTO);

    StoreResponseDTO getStore();

    StoreResponseDTO updateStore(StoreRequestDTO storeRequestDTO);

    StoreResponseDTO deleteStore();

    Map<String, String> uploadMedia(MultipartFile banner, MultipartFile profilePhoto);

    List<OrderResponseDTO> getStoreOrders();

    StoreResponseDTO deactivateStore();

    StoreResponseDTO reactivateStore();

    OrderItemResponseDTO shipOrderItem(Long orderItemId);

    OrderItemResponseDTO cancelOrderItemBySeller(Long orderItemId);
}
