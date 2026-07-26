package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.response.CartResponseDTO;
import com.cdac.ecommerce.dto.response.CheckoutResponseDTO;
import com.cdac.ecommerce.dto.response.CustomerAddressResponseDTO;
import com.cdac.ecommerce.entity.Cart;
import com.cdac.ecommerce.entity.CustomerAddress;
import com.cdac.ecommerce.mapper.CartMapper;
import com.cdac.ecommerce.mapper.CustomerAddressMapper;
import com.cdac.ecommerce.repository.CartRepository;
import com.cdac.ecommerce.repository.CustomerAddressRepository;
import com.cdac.ecommerce.service.CheckoutService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CartRepository cartRepository;
    private final CustomerAddressRepository addressRepository;
    private final CartMapper cartMapper;
    private final CustomerAddressMapper addressMapper;

    public CheckoutServiceImpl(CartRepository cartRepository,
                               CustomerAddressRepository addressRepository,
                               CartMapper cartMapper,
                               CustomerAddressMapper addressMapper) {
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.cartMapper = cartMapper;
        this.addressMapper = addressMapper;
    }

    @Override
    public CheckoutResponseDTO getCheckout(Long userId) {
        //et all cart items
        List<Cart> cartItems = cartRepository.findByUser_Id(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }
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
                        .map(addressMapper::toResponseDTO)
                        .toList();

        CheckoutResponseDTO response = new CheckoutResponseDTO();

        response.setCartItems(cartDTOs);
        response.setAddresses(addressDTOs);
        response.setSubtotal(subtotal);
        response.setGrandTotal(grandTotal);
        return response;



    }


}
