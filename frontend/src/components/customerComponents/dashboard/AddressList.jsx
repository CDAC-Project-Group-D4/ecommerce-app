import React from "react";
import { AddressCard } from "./AddressCard";

export function AddressList({ addresses, loading, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "var(--cart-orange)" }}
          role="status"
        />
        <p className="mt-3" style={{ color: "var(--cart-muted)" }}>
          Loading your addresses...
        </p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: "3.5rem" }}>📍</div>
        <h5 className="mt-3 fw-bold" style={{ color: "var(--cart-text)" }}>
          No saved addresses found
        </h5>
        <p style={{ color: "var(--cart-muted)" }}>
          Save an address to facilitate faster checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {addresses.map((addr, idx) => (
        <AddressCard
          key={addr.id || addr.addressId || idx}
          address={addr}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
