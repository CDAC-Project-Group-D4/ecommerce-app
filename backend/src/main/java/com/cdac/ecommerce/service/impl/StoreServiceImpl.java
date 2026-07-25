package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.repository.StoreRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.AuthService;
import com.cdac.ecommerce.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepo userRepository;
    private final ModelMapper modelMapper;

    @Override
    public StoreResponseDTO createStore(StoreRequestDTO storeRequestDTO) {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String email = userDetails.getUsername();
            User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

            if (user.getRole() != Roles.SELLER) {
                throw new RuntimeException("only sellers can create a store");
            }

            if (user.getStore() != null) {
                throw new RuntimeException("seller already has a store");
            }

            Store store = modelMapper.map(storeRequestDTO, Store.class);
            store.setUser(user);
            Store newStore = storeRepository.save(store);
            return modelMapper.map(newStore, StoreResponseDTO.class);
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
}
