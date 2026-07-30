package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import com.cdac.ecommerce.exception.SellerCreateStoreException;
import com.cdac.ecommerce.exception.StoreAlreadyExistsException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.mapper.OrderMapper;
import com.cdac.ecommerce.repository.OrderRepository;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.repository.StoreRepository;
import com.cdac.ecommerce.repository.UserRepo;
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
    private final ModelMapper modelMapper;

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
            throw new RuntimeException("Store not found for this user");
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
            throw new RuntimeException("Store not found for this user");
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
            throw new RuntimeException("Store not found for this user");
        }

        productRepository.deleteAll(store.getProductList()); //delete all the products associated with that store as well.

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
            throw new RuntimeException("Store not found for this user");
        }

        //deactivate store
        store.setActive(false);

        //deactivate products
        if(store.getProductList()!=null){
            for(Product product : store.getProductList()){
                product.set_active(false);
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
            throw new RuntimeException("Store not found for this user");
        }

        //reactive store
        store.setActive(true);

        //reactive products (that have stock available > 0)
        if(store.getProductList()!=null){
            for(Product product : store.getProductList()){
                if(product.getStock()>0){
                    product.set_active(true);
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
            throw new RuntimeException("Store not found for this user");
        }

        List<Order> orders = orderRepository.findOrdersByStoreId(store.getId());
        return orders.stream().map(order -> modelMapper.map(order, OrderResponseDTO.class)).collect(Collectors.toList());
    }

    
   
}
