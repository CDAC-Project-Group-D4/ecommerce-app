package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.CustomerComplaintRequestDTO;
import com.cdac.ecommerce.dto.response.CustomerComplaintResponseDTO;
import com.cdac.ecommerce.entity.CustomerComplaint;
import com.cdac.ecommerce.entity.Order;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.OrderNotFoundException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.mapper.CustomerComplaintMapper;
import com.cdac.ecommerce.repository.CustomerComplaintRepo;
import com.cdac.ecommerce.repository.OrderRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.service.CustomerComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerComplaintServiceImpl implements CustomerComplaintService {

    private final CustomerComplaintRepo repo;
    private final UserRepo userRepo;
    private final CustomerComplaintMapper mapper;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerComplaintResponseDTO> getCustomerComplaintById(Long customerId) {
        return repo.findByCustomer_Id(customerId).stream().map(mapper::toDto).toList();
    }

    @Override
    @Transactional
    public CustomerComplaintResponseDTO createComplaint(CustomerComplaintRequestDTO complaintRequestDTO) {

        CustomerComplaint complaint = mapper.toEntity(complaintRequestDTO);

        User customer = userRepo
                .findById(complaintRequestDTO.customerId())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with user id: " + complaintRequestDTO.customerId() + " does not exist!"));

        complaint.setCustomer(customer);

        if(complaintRequestDTO.orderId() != null){
            Order order = orderRepository.findById(complaintRequestDTO.orderId())
                    .orElseThrow(() -> new OrderNotFoundException("Order with id: " + complaintRequestDTO.orderId() + " does not exist"));

            complaint.setOrder(order);
        }


        CustomerComplaint savedComplaint = repo.save(complaint);
        return mapper.toDto(savedComplaint);
    }
}
