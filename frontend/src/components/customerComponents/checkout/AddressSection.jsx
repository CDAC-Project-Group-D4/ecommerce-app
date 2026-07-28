function AddressSection({
                            addresses,
                            selectedAddress,
                            setSelectedAddress
                        }) {

    return (
        <div className="checkout-card">

            <h3>📍 Delivery Address</h3>

            {
                addresses.length === 0 ?

                    <div className="empty-state">
                        <h5>No Address Found</h5>
                        <p>Please add a delivery address.</p>
                    </div>

                    :

                    addresses.map(address => (

                        <div
                            key={address.id}
                            className={`address-card ${
                                selectedAddress === address.id ? "selected" : ""
                            }`}
                            onClick={() => setSelectedAddress(address.id)}
                        >

                            <div className="address-top">

                                <span className="address-label">
                                    {address.label}
                                </span>

                                {
                                    selectedAddress === address.id &&
                                    <span className="selected-badge">
                                        ✓ Selected
                                    </span>
                                }

                            </div>

                            <h5>{address.fullName}</h5>

                            <p>{address.mobileNumber}</p>

                            <p>

                                {address.addressLine1}

                                {address.addressLine2 &&
                                    `, ${address.addressLine2}`}

                                <br />

                                {address.city},

                                {address.state}

                                -

                                {address.pincode}

                            </p>

                        </div>

                    ))

            }

        </div>
    );
}

export default AddressSection;