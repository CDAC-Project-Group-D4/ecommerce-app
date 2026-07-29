package com.cdac.ecommerce.dto.request;

public record ChangePasswordRequestDTO (
//        @NotBlank(message = "Old password is required")
        String oldPassword,

//                                          @NotBlank(message = "New password is required")
        String newPassword
){
}
