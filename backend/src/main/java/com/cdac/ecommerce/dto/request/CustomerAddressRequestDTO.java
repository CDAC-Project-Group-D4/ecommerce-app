package com.cdac.ecommerce.dto.request;

import com.cdac.ecommerce.entity.enums.AddressLabel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerAddressRequestDTO {

    @NotBlank(message = "Full name is required")
    @Size(max = 100)
    private String fullName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9+ -]{7,15}$", message = "Enter a valid mobile number")
    private String mobileNumber;

    @NotNull(message = "Address label is required")
    private AddressLabel label;

    @NotBlank(message = "Address line 1 is required")
    @Size(max = 255)
    private String addressLine1;

    @Size(max = 255)
    private String addressLine2;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9A-Za-z -]{3,12}$", message = "Enter a valid pincode")
    private String pincode;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotBlank(message = "Country is required")
    @Size(max = 100)
    private String country;
}