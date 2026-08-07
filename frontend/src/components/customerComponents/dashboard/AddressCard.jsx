import React from "react";

export function AddressCard({ address, onDelete }) {
  const addressId = address.id || address.addressId;
  const name = address.fullName || address.name || "N/A";
  const phone = address.mobileNumber || address.phone || address.mobile || "";

  return (
    <div className="col-md-6 mb-3">
      <div className="card cart-item-card h-100">
        <div className="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span
                className="badge px-3 py-2 rounded-pill"
                style={{
                  backgroundColor: "#FFF8F3",
                  color: "var(--cart-orange-dark)",
                  border: "1px solid rgba(255, 122, 41, 0.25)",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                {address.label || "HOME"}
              </span>

              {addressId && (
                <button
                  onClick={() => onDelete(addressId)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Remove
                </button>
              )}
            </div>

            <h6 className="fw-bold mb-1" style={{ color: "var(--cart-text)", fontSize: "1.05rem" }}>
              {name}
            </h6>

            {phone && (
              <small className="d-block mb-2" style={{ color: "var(--cart-muted)" }}>
                📞 {phone}
              </small>
            )}

            <p className="mb-1 small" style={{ color: "var(--cart-text)", lineHeight: "1.5" }}>
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
            </p>

            <small style={{ color: "var(--cart-muted)" }}>
              {address.city}, {address.state} - {address.pincode} ({address.country})
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}