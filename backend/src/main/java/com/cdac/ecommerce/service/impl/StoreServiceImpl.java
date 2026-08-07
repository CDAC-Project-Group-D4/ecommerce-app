package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.SellerCreateStoreException;
import com.cdac.ecommerce.exception.StoreAlreadyExistsException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.dto.response.OrderItemResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.mapper.OrderMapper;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.repository.CartRepository;
import com.cdac.ecommerce.repository.OrderItemRepository;
import com.cdac.ecommerce.repository.OrderRepository;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.repository.ReturnRequestRepo;
import com.cdac.ecommerce.repository.ReviewRepository;
import com.cdac.ecommerce.repository.StoreRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.repository.WishlistRepository;
import com.cdac.ecommerce.entity.OrderItem;
import com.cdac.ecommerce.service.NotificationService;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.StoreService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserRepo userRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReturnRequestRepo returnRequestRepo;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final OrderMapper orderMapper;

    @Override
    public StoreResponseDTO createStore(StoreRequestDTO storeRequestDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.getRole()!= Roles.SELLER) {
            throw new SellerCreateStoreException("only sellers can create a store");
        }

        if (user.getStore() != null) {
            throw new StoreAlreadyExistsException("seller already has a store");
        }

        Store store = modelMapper.map(storeRequestDTO, Store.class);
        store.setUser(user);
        Store newStore = storeRepository.save(store);
        StoreResponseDTO storeResponseDTO= modelMapper.map(newStore, StoreResponseDTO.class);
        storeResponseDTO.setMessage("Store created succesfully");
        return storeResponseDTO;
    }

    @Override
    public StoreResponseDTO getStore() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        Store store = user.getStore();
        if (store == null) {
            throw new ResourceNotFoundException("Store not found for this user");
        }
        return modelMapper.map(store, StoreResponseDTO.class);
    }

    @Override
    public StoreResponseDTO updateStore(StoreRequestDTO storeRequestDTO) {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email= userDetails.getUsername();
        User user= userRepository.findByEmail(email).orElseThrow(()-> new UserNotFoundException("User not found"));

        Store store= user.getStore();
        if(store == null){
            throw new ResourceNotFoundException("Store not found for this user");
        }

        if(storeRequestDTO.getStoreName()!=null){
            store.setStoreName(storeRequestDTO.getStoreName());
        }
        if(storeRequestDTO.getDescription()!=null){
            store.setDescription(storeRequestDTO.getDescription());
        }

        if (storeRequestDTO.getBannerUrl() != null && !storeRequestDTO.getBannerUrl().isBlank()) {
            store.setBannerUrl(storeRequestDTO.getBannerUrl());
        }

        if (storeRequestDTO.getProfilePhotoUrl() != null && !storeRequestDTO.getProfilePhotoUrl().isBlank()) {
            store.setProfilePhotoUrl(storeRequestDTO.getProfilePhotoUrl());
        }

        Store updatedStore= storeRepository.save(store);
        StoreResponseDTO storeResponseDTO= modelMapper.map(updatedStore,StoreResponseDTO.class);
        storeResponseDTO.setMessage("Store updated succesfully");
        return storeResponseDTO;
    }

    //hard delete
    @Override
    @Transactional
    public StoreResponseDTO deleteStore() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails= (UserDetailsImpl) authentication.getPrincipal();
        String email= userDetails.getUsername();
        User user= userRepository.findByEmail(email).orElseThrow(()-> new UserNotFoundException("User not found"));

        Store store= user.getStore();
        if(store == null){
            throw new ResourceNotFoundException("Store not found for this user");
        }

        // 1. Check if store has any active/pending orders before allowing permanent deletion
        List<Order> storeOrders = orderRepository.findOrdersByStoreId(store.getId());
        boolean hasPendingOrders = storeOrders != null && storeOrders.stream().anyMatch(order -> 
            order.getOrderStatus() == OrderStatus.PENDING ||
            order.getOrderStatus() == OrderStatus.CONFIRMED ||
            order.getOrderStatus() == OrderStatus.SHIPPED ||
            order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY
        );

        if (hasPendingOrders) {
            throw new IllegalStateException("Cannot delete store permanently while you have active/pending orders. Please fulfill or cancel your orders first.");
        }

        // 2. Clean up products and all associated dependent records
        List<Product> products = store.getProductList();
        if (products != null && !products.isEmpty()) {
            List<Long> productIds = products.stream().map(Product::getId).toList();

            returnRequestRepo.deleteByProduct_IdIn(productIds);
            orderItemRepository.deleteByProduct_IdIn(productIds);
            cartRepository.deleteByProduct_IdIn(productIds);
            wishlistRepository.deleteByProduct_IdIn(productIds);
            reviewRepository.deleteByProduct_IdIn(productIds);

            productRepository.deleteAll(products);
        }

        // 3. Disassociate and delete store
        user.setStore(null);
        userRepository.save(user);
        storeRepository.delete(store);

        StoreResponseDTO storeResponseDTO= new StoreResponseDTO();
        storeResponseDTO.setMessage("store deleted successfully");
        return storeResponseDTO;
    }

    //soft delete(deactivate store)
    @Override
    @Transactional
    public StoreResponseDTO deactivateStore() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails= (UserDetailsImpl) authentication.getPrincipal();
        String email= userDetails.getUsername();
        User user= userRepository.findByEmail(email).orElseThrow(()-> new UserNotFoundException("User not found"));

        Store store= user.getStore();
        if(store == null){
            throw new ResourceNotFoundException("Store not found for this user");
        }

        //deactivate store
        store.setActive(false);

        //deactivate products
        if(store.getProductList()!=null){
            for(Product product : store.getProductList()){
                product.setActive(false);
            }
        }

        Store updateStore = storeRepository.save(store);
        StoreResponseDTO storeResponseDTO= modelMapper.map(updateStore, StoreResponseDTO.class);
        storeResponseDTO.setMessage("store and all associated products are now inactive");
        return storeResponseDTO;
    }

    //reactivate store
    @Override
    @Transactional
    public StoreResponseDTO reactivateStore() {
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails= (UserDetailsImpl) authentication.getPrincipal();
        String email= userDetails.getUsername();
        User user= userRepository.findByEmail(email).orElseThrow(()-> new UserNotFoundException("User not found"));

        Store store= user.getStore();
        if(store == null){
            throw new ResourceNotFoundException("Store not found for this user");
        }

        //reactive store
        store.setActive(true);

        //reactive products (that have stock available > 0)
        if(store.getProductList()!=null){
            for(Product product : store.getProductList()){
                if(product.getStock()>0){
                    product.setActive(true);
                }
            }
        }

        Store updatedStore = storeRepository.save(store);
        StoreResponseDTO storeResponseDTO= modelMapper.map(updatedStore, StoreResponseDTO.class);
        storeResponseDTO.setMessage("store and products with stock>0 are reactivated");
        return storeResponseDTO;

    }


    @Override
    public Map<String, String> uploadMedia(MultipartFile banner, MultipartFile profilePhoto) {
        Map<String, String> response = new HashMap<>();

        try {
            if (banner != null && !banner.isEmpty()) {
                String bannerUrl = saveFile(banner);
                response.put("bannerUrl", bannerUrl);
            }

            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                String profilePhotoUrl = saveFile(profilePhoto);
                response.put("profilePhotoUrl", profilePhotoUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }

        return response;
    }

    private String saveFile(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + fileName;
    }

    @Override
    public List<OrderResponseDTO> getStoreOrders() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Store store = user.getStore();
        if (store == null) {
            return Collections.emptyList();
        }

        Long storeId = store.getId();
        List<Order> orders = orderRepository.findOrdersByStoreId(storeId);

        // Fix order status in DB if order items have sufficient stock
        for (Order order : orders) {
            if (order.getOrderStatus() == OrderStatus.PLACED || order.getOrderStatus() == OrderStatus.PENDING) {
                boolean allInStock = true;
                if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                    for (OrderItem item : order.getOrderItems()) {
                        if (item.getProduct() != null && item.getProduct().getStock() < item.getQuantity()) {
                            allInStock = false;
                            break;
                        }
                    }
                } else {
                    allInStock = false;
                }

                if (allInStock) {
                    order.setOrderStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order);
                }
            }
        }
        
        return orders.stream().map(order -> {
            OrderResponseDTO dto = orderMapper.toOrderResponseDTO(order);
            if (order.getOrderItems() != null) {
                List<OrderItemResponseDTO> storeOnlyItems = order.getOrderItems().stream()
                    .filter(item -> item.getProduct() != null && item.getProduct().getStore() != null && item.getProduct().getStore().getId().equals(storeId))
                    .map(item -> {
                        OrderItemResponseDTO itemDto = new OrderItemResponseDTO();
                        itemDto.setOrderItemId(item.getId());
                        itemDto.setProductId(item.getProduct().getId());
                        itemDto.setProductName(item.getProduct().getName());
                        itemDto.setProductImage(item.getProduct().getImageUrl());
                        itemDto.setQuantity(item.getQuantity());
                        itemDto.setPrice(item.getPrice());
                        itemDto.setLineTotal(item.getLineTotal());
                        return itemDto;
                    })
                    .collect(Collectors.toList());
                dto.setOrderItems(storeOnlyItems);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    
   
}
