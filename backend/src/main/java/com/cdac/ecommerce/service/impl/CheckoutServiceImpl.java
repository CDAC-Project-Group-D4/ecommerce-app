package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.dto.response.CheckoutResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.dto.request.CustomerAddressRequestDTO;
import com.cdac.ecommerce.entity.Cart;
import com.cdac.ecommerce.entity.CustomerAddress;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.mapper.CartMapper;
import com.cdac.ecommerce.mapper.CustomerAddressMapper;
import com.cdac.ecommerce.repository.CartRepository;
import com.cdac.ecommerce.repository.CustomerAddressRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.CheckoutService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CartRepository cartRepository;
    private final CustomerAddressRepository addressRepository;
    private final UserRepo userRepository;
    private final CartMapper cartMapper;
    private final CustomerAddressMapper addressMapper;

    public CheckoutServiceImpl(CartRepository cartRepository,
                               CustomerAddressRepository addressRepository,
                               UserRepo userRepository,
                               CartMapper cartMapper,
                               CustomerAddressMapper addressMapper) {
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.cartMapper = cartMapper;
        this.addressMapper = addressMapper;
    }

    @Override
    public CheckoutResponseDTO getCheckout(Long userId) {
        //et all cart items
        List<Cart> cartItems = cartRepository.findByUser_Id(userId);
//        if (cartItems.isEmpty()) {
//            throw new IllegalStateException("Cart is empty");
//        }
        List<CustomerAddress> customerAddressList = addressRepository.findByUser_IdAndActiveTrue(userId);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (Cart cart : cartItems) {
            BigDecimal price = cart.getProduct().getPrice();
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(cart.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }
        BigDecimal grandTotal = subtotal;

        List<CartResponseDTO> cartDTOs =
                cartItems.stream()
                        .map(cartMapper::toResponseDTO)
                        .toList();

        List<CustomerAddressResponseDTO> addressDTOs =
                customerAddressList.stream()
                        .map(addressMapper::toResponseDto)
                        .toList();

        CheckoutResponseDTO response = new CheckoutResponseDTO();

        response.setCartItems(cartDTOs);
        response.setAddresses(addressDTOs);
        response.setSubtotal(subtotal);
        response.setGrandTotal(grandTotal);
        return response;



    }

    @Override
    @Transactional
    public CustomerAddressResponseDTO addAddress(
            Long userId,
            CustomerAddressRequestDTO request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CustomerAddress address = new CustomerAddress();
        address.setUser(user);
        address.setFullName(request.fullName().trim());
        address.setMobileNumber(request.mobileNumber().trim());
        address.setLabel(request.label());
        address.setAddressLine1(request.addressLine1().trim());
        address.setAddressLine2(
                request.addressLine2() == null
                        ? null
                        : request.addressLine2().trim()
        );
        address.setPincode(request.pincode().trim());
        address.setCity(request.city().trim());
        address.setState(request.state().trim());
        address.setCountry(request.country().trim());
        address.setActive(true);

        return addressMapper.toResponseDto(addressRepository.save(address));
    }


}
