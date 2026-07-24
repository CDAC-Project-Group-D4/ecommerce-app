package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.StoreRequestDTO;
import com.cdac.ecommerce.dto.response.StoreResponseDTO;
import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.entity.enums.Roles;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.repository.StoreRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserRepo userRepository;
    private final ModelMapper modelMapper;

    @Override
    public StoreResponseDTO createStore(StoreRequestDTO storeRequestDTO) {

        //fetch user
        User user= userRepository.findById(storeRequestDTO.getUser_id()).orElseThrow(()-> new UserNotFoundException("user not found"));

        //check role
        if(user.getRole()!= Roles.SELLER){
            throw new RuntimeException("only sellers can create a store");
        }

        //check if already has store
        if(user.getStore()!=null){
            throw new RuntimeException("seller already has a store");
        }

        Store store= modelMapper.map(storeRequestDTO, Store.class);
        store.setUser(user);
        Store newStore= storeRepository.save(store);
        return modelMapper.map(newStore, StoreResponseDTO.class);
    }
}
