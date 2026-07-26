package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.PlaceOrderRequestDTO;
import com.cdac.ecommerce.dto.response.OrderResponseDTO;
import com.cdac.ecommerce.entity.*;
import com.cdac.ecommerce.entity.enums.OrderStatus;
import com.cdac.ecommerce.entity.enums.PaymentMethod;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.mapper.OrderMapper;
import com.cdac.ecommerce.repository.*;
import com.cdac.ecommerce.service.OrderService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerAddressRepository addressRepository;
    private final UserRepo userRepo;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartRepository cartRepository,
                            OrderItemRepository orderItemRepository,
                            CustomerAddressRepository addressRepository,
                            UserRepo userRepo,
                            OrderMapper orderMapper) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.userRepo = userRepo;
        this.orderMapper = orderMapper;
    }

    @Override
    public OrderResponseDTO placeOrder(Long userId, PlaceOrderRequestDTO request) {

       User user= userRepo.findById(userId)
               .orElseThrow(()->new ResourceNotFoundException("User not found"));

       List<Cart> cartItems= cartRepository.findByUser_Id(userId);
       if(cartItems.isEmpty()){
           throw new IllegalStateException("Cart is empty");
       }

       CustomerAddress address= addressRepository.findByIdAndUser_Id(request.getAddressId(),userId)
               .orElseThrow(()-> new ResourceNotFoundException("Address not found"));

       //create a order
        Order order =new Order();
        order.setUser(user);
        order.setAddress(address);

        order.setPaymentMethod(request.getPaymentMethod());

        if(request.getPaymentMethod()== PaymentMethod.CASH_ON_DELIVERY){
            order.setOrderStatus(OrderStatus.CONFIRMED);
        }
        else{
            order.setOrderStatus(OrderStatus.PENDING);

            order.setPaymentRef(
                    "PAY-" + System.currentTimeMillis()
            );
        }

        order.setPlacedAt(LocalDateTime.now());

        BigDecimal totalAmount= BigDecimal.ZERO;

        // Create OrderItems
        for(Cart cart:cartItems){
            BigDecimal price=cart.getProduct().getPrice();

            BigDecimal lineTotal=price.multiply
                    (BigDecimal.valueOf(cart.getQuantity()));

            totalAmount=totalAmount.add(lineTotal);

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(cart.getProduct());
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(price);
            orderItem.setLineTotal(lineTotal);
            order.getOrderItems().add(orderItem);


        }

        order.setTotalAmt(totalAmount);

        //save order
        Order savedOrder = orderRepository.save(order);

        //save orderItems
        orderItemRepository.saveAll(savedOrder.getOrderItems());

        //clear cart
        cartRepository.deleteAll(cartItems);

        return orderMapper.toOrderResponseDTO(savedOrder);
    }


    @Override
    public List<OrderResponseDTO> getMyOrders(Long userId) {
        List<Order> orders=orderRepository.findByUser_IdOrderByPlacedAtDesc(userId);
        List<OrderResponseDTO> orderResponseList = new ArrayList<>();

        for(Order order : orders ){
            orderResponseList.add(orderMapper.toOrderResponseDTO(order));
        }
        return orderResponseList;
    }


    @Override
    public OrderResponseDTO getOrderById(Long userId, Long orderId) {
       Order order=orderRepository.findByIdAndUser_Id(orderId,userId)
               .orElseThrow(()->new ResourceNotFoundException("Order not found"));

        return orderMapper.toOrderResponseDTO(order);
    }

    @Override
    public void cancelOrder(Long userId, Long orderId) {
        Order order=orderRepository.findByIdAndUser_Id(orderId,userId)
                .orElseThrow(()-> new ResourceNotFoundException( "Order not found"));

        if(order.getOrderStatus() == OrderStatus.SHIPPED ||
                order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY ||
                order.getOrderStatus() == OrderStatus.DELIVERED){

            throw new IllegalStateException( "Order cannot be cancelled" );

        }
        order.setOrderStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);

    }


}
