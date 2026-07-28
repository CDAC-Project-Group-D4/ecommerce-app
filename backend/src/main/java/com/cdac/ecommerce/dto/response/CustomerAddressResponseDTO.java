package com.cdac.ecommerce.dto.response;

import com.cdac.ecommerce.entity.enums.AddressLabel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAddressResponseDTO {

    private Long id;

    private String fullName;

    private String mobileNumber;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private boolean defaultAddress;
    private AddressLabel label;
}