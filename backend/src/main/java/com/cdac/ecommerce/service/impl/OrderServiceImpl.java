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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class
OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerAddressRepository addressRepository;
    private final UserRepo userRepo;
    private final ProductRepository productRepository;
    private final com.cdac.ecommerce.service.NotificationService notificationService;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartRepository cartRepository,
                            OrderItemRepository orderItemRepository,
                            CustomerAddressRepository addressRepository,
                            UserRepo userRepo,
                            ProductRepository productRepository,
                            com.cdac.ecommerce.service.NotificationService notificationService,
                            OrderMapper orderMapper) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.orderItemRepository = orderItemRepository;
        this.addressRepository = addressRepository;
        this.userRepo = userRepo;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
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

       // 1. Verify stock availability for all items in cart first
       for (Cart cart : cartItems) {
           Product product = cart.getProduct();
           if (product.getStock() < cart.getQuantity()) {
               throw new IllegalStateException("Insufficient stock for product: " + product.getName() + 
                       ". Available: " + product.getStock() + ", Required: " + cart.getQuantity());
           }
       }

       // Create order
        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderStatus(OrderStatus.CONFIRMED);

        if (request.getPaymentMethod() != PaymentMethod.CASH_ON_DELIVERY) {
            order.setPaymentRef("PAY-" + System.currentTimeMillis());
        }

        order.setPlacedAt(LocalDateTime.now());

        BigDecimal totalAmount = BigDecimal.ZERO;

        // Create OrderItems & deduct stock in database ONCE
        for (Cart cart : cartItems) {
            BigDecimal price = cart.getProduct().getPrice();
            BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(cart.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);

            Product product = cart.getProduct();
            orderItem.setProduct(product);
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setPrice(price);
            orderItem.setLineTotal(lineTotal);
            orderItem.setItemStatus(OrderStatus.CONFIRMED);
            order.getOrderItems().add(orderItem);

            // Deduct stock, set inactive if stock reaches 0, and save to DB
            int updatedStock = Math.max(0, product.getStock() - cart.getQuantity());
            product.setStock(updatedStock);
            if (updatedStock == 0) {
                product.setActive(false);
            }
            productRepository.save(product);

            // Trigger notification check for seller
            notificationService.checkAndTriggerLowStockNotification(product);
        }

        order.setTotalAmt(totalAmount);

        // Save order & orderItems
        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(savedOrder.getOrderItems());

        // Clear cart
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
    @Transactional
    public void cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUser_Id(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled");
        }

        if (order.getOrderStatus() == OrderStatus.SHIPPED ||
                order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY ||
                order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.COMPLETED) {

            throw new IllegalStateException("Order cannot be cancelled at this stage");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        // Restore product stock and set itemStatus to CANCELLED for all items
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setItemStatus(OrderStatus.CANCELLED);
                orderItemRepository.save(item);

                Product product = item.getProduct();
                if (product != null) {
                    int restoredStock = product.getStock() + item.getQuantity();
                    product.setStock(restoredStock);
                    if (restoredStock > 0 && product.getStore() != null && product.getStore().isActive()) {
                        product.setActive(true);
                    }
                    productRepository.save(product);
                }
            }
        }

        orderRepository.save(order);
    }

    @Override
    @Transactional
    public OrderResponseDTO cancelOrderItem(Long userId, Long orderId, Long orderItemId) {
        Order order = orderRepository.findByIdAndUser_Id(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found in this order"));

        if (orderItem.getItemStatus() != OrderStatus.PENDING
                && orderItem.getItemStatus() != OrderStatus.PLACED
                && orderItem.getItemStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order item cannot be cancelled at its current status");
        }

        orderItem.setItemStatus(OrderStatus.CANCELLED);

        Product product = orderItem.getProduct();
        product.setStock(product.getStock() + orderItem.getQuantity());

        boolean allItemsCancelled = order.getOrderItems().stream()
                .allMatch(item -> item.getItemStatus() == OrderStatus.CANCELLED);
        if (allItemsCancelled) {
            order.setOrderStatus(OrderStatus.CANCELLED);
        }

        productRepository.save(product);
        orderItemRepository.save(orderItem);
        orderRepository.save(order);

        return orderMapper.toOrderResponseDTO(order);
    }


}
