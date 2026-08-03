package com.cdac.ecommerce.service;

import com.cdac.ecommerce.dto.request.ReturnRequestDTO;
import com.cdac.ecommerce.dto.response.ReturnRequestResponseDTO;
import com.cdac.ecommerce.dto.response.ReturnResponseDTO;
import com.cdac.ecommerce.dto.request.SellerReturnDecisionDTO;
import com.cdac.ecommerce.entity.User;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ReturnService {

    // Create a return/refund request
    ReturnResponseDTO createReturnRequest(
            Long userId,
            ReturnRequestDTO requestDTO,
            List<MultipartFile> images
    );

    // Get all return requests of the logged-in customer
    List<ReturnResponseDTO> getMyReturns(
            Long userId
    );

    // Get details of a particular return request
    ReturnResponseDTO getReturnById(
            Long userId,
            Long returnRequestId
    );

    List<ReturnResponseDTO> getSellerReturns(Long sellerId);

    ReturnResponseDTO decideReturn(
            Long sellerId,
            Long returnRequestId,
            SellerReturnDecisionDTO requestDTO
    );

//    ReturnRequestResponseDTO createReturnRequestWithImages(@Valid ReturnRequestDTO requestDTO, List<MultipartFile> images, User user);
}
