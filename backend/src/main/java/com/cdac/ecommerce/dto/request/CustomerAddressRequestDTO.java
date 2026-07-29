package com.cdac.ecommerce.dto.request;
import com.cdac.ecommerce.entity.enums.AddressLabel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CustomerAddressRequestDTO(

        @NotBlank(message = "Full name is required")
        String fullName,

        @NotBlank(message = "Mobile number is required")
        String mobileNumber,

        @NotNull(message = "Address label is required")
        AddressLabel label,

        @NotBlank(message = "Address Line 1 is required")
        String addressLine1,

        String addressLine2,

        @NotBlank(message = "Pincode is required")
        String pincode,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        String state,

        @NotBlank(message = "Country is required")
        String country

) {
}
