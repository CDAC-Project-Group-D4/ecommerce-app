import React, { useState } from "react";

const INITIAL_FORM_STATE = {
  fullName: "",
  mobileNumber: "",
  label: "HOME",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  country: "India",
};

export function AddressForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="card summary-card border-0 mb-4 p-2">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Add New Address</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onCancel}
          ></button>
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="form-control rounded-3"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              className="form-control rounded-3"
              placeholder="9876543210"
              value={form.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Address Label
            </label>
            <select
              name="label"
              className="form-select rounded-3"
              value={form.label}
              onChange={handleChange}
              required
            >
              <option value="HOME">HOME</option>
              <option value="OFFICE">OFFICE</option>
              <option value="WORK">WORK</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="col-md-8">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Address Line 1
            </label>
            <input
              type="text"
              name="addressLine1"
              className="form-control rounded-3"
              placeholder="House / Flat No., Street, Area"
              value={form.addressLine1}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-12">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="addressLine2"
              className="form-control rounded-3"
              placeholder="Landmark"
              value={form.addressLine2}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              City
            </label>
            <input
              type="text"
              name="city"
              className="form-control rounded-3"
              placeholder="Mumbai"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              State
            </label>
            <input
              type="text"
              name="state"
              className="form-control rounded-3"
              placeholder="Maharashtra"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              className="form-control rounded-3"
              placeholder="400001"
              value={form.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold" style={{ color: "var(--cart-muted)" }}>
              Country
            </label>
            <select
              name="country"
              className="form-select rounded-3"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div className="col-12 mt-4 d-flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-accent px-4 py-2"
              style={{ width: "auto" }}
            >
              {submitting ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}