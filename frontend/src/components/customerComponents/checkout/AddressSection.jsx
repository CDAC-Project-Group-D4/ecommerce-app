import { useState } from "react";

const emptyAddress = {
    fullName: "",
    mobileNumber: "",
    label: "HOME",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
    country: "India"
};

function AddressSection({
    addresses,
    selectedAddress,
    setSelectedAddress,
    savingAddress,
    onAddAddress
}) {
    const [showForm, setShowForm] = useState(addresses.length === 0);
    const [formData, setFormData] = useState(emptyAddress);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const saved = await onAddAddress(formData);
        if (saved) {
            setFormData(emptyAddress);
            setShowForm(false);
        }
    };

    return (
        <div className="checkout-card">
            <div className="address-section-heading">
                <h3>📍 Delivery Address</h3>

                {addresses.length > 0 && !showForm && (
                    <button
                        type="button"
                        className="add-address-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add New Address
                    </button>
                )}
            </div>

            {addresses.length === 0 && !showForm && (
                <div className="empty-state">
                    <h5>No Address Found</h5>
                    <p>Please add a delivery address.</p>
                    <button
                        type="button"
                        className="add-address-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Address
                    </button>
                </div>
            )}

            {addresses.length > 0 && (
                <div className="address-list">
                    {addresses.map((address) => (
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

                                {selectedAddress === address.id && (
                                    <span className="selected-badge">
                                        ✓ Selected
                                    </span>
                                )}
                            </div>

                            <h5>{address.fullName}</h5>
                            <p>{address.mobileNumber}</p>
                            <p>
                                {address.addressLine1}
                                {address.addressLine2 &&
                                    `, ${address.addressLine2}`}
                                <br />
                                {address.city}, {address.state} -{" "}
                                {address.pincode}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <form className="address-form" onSubmit={handleSubmit}>
                    <div className="address-form-header">
                        <h4>
                            {addresses.length === 0
                                ? "Add Delivery Address"
                                : "Add New Address"}
                        </h4>

                        {addresses.length > 0 && (
                            <button
                                type="button"
                                className="address-form-close"
                                onClick={() => setShowForm(false)}
                                aria-label="Close address form"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="address-form-grid">
                        <label>
                            Full Name
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Mobile Number
                            <input
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                inputMode="tel"
                                required
                            />
                        </label>

                        <label>
                            Address Type
                            <select
                                name="label"
                                value={formData.label}
                                onChange={handleChange}
                            >
                                <option value="HOME">Home</option>
                                <option value="OFFICE">Office</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </label>

                        <label className="address-field-wide">
                            Address Line 1
                            <input
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                placeholder="House number, street or building"
                                required
                            />
                        </label>

                        <label className="address-field-wide">
                            Address Line 2
                            <input
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                placeholder="Area or landmark (optional)"
                            />
                        </label>

                        <label>
                            City
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            State
                            <input
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Pincode
                            <input
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                inputMode="numeric"
                                required
                            />
                        </label>

                        <label>
                            Country
                            <input
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="address-form-actions">
                        {addresses.length > 0 && (
                            <button
                                type="button"
                                className="address-cancel-btn"
                                onClick={() => setShowForm(false)}
                                disabled={savingAddress}
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            className="address-save-btn"
                            disabled={savingAddress}
                        >
                            {savingAddress
                                ? "Saving Address..."
                                : "Save Address"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default AddressSection;
