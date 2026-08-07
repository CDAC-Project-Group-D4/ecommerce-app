import React, { useState, useEffect } from "react";
import { customerAccountApi } from "../../../api/customerApi";
import { AddressList } from "./AddressList";
import { AddressForm } from "./AddressForm";
import "../../../css/Cart.css";

export function AddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAddresses = () => {
    setLoading(true);
    customerAccountApi
      .getAddresses()
      .then((res) => {
        let dataList = [];
        if (Array.isArray(res)) {
          dataList = res;
        } else if (Array.isArray(res?.data)) {
          dataList = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          dataList = res.data.data;
        }
        setAddresses(dataList);
      })
      .catch((err) => console.error("Failed to load addresses:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddAddress = async (formData) => {
    setSubmitting(true);
    try {
      await customerAccountApi.addAddress(formData);
      setShowForm(false);
      loadAddresses();
    } catch (err) {
      console.error("Failed to save address:", err);
      alert(
        err.response?.data?.message ||
          "Failed to save address. Please verify all inputs.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!itemToDelete || deleting) return;
    setDeleting(true);
    try {
      await customerAccountApi.deleteAddress(itemToDelete);
      setItemToDelete(null);
      loadAddresses();
    } catch (err) {
      console.error("Failed to delete address:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* Utility styles mapped to Cart CSS variables */}
      <style>{`
        .btn-accent {
          border: 0 !important;
          border-radius: 11px !important;
          background: var(--cart-gradient) !important;
          color: #fff !important;
          font-weight: 700;
          letter-spacing: 0.01em;
          box-shadow: 0 7px 16px rgba(255, 92, 0, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .btn-accent:hover {
          transform: translateY(-2px);
          color: #fff !important;
          filter: saturate(1.12);
          box-shadow: 0 10px 22px rgba(255, 92, 0, 0.32);
        }
        .btn-accent:active {
          transform: translateY(0);
        }
      `}</style>

      {/* Styled Gradient Header */}
      <div className="cart-header text-center mb-4">
        <h2 className="fw-bold mb-1">📍 Saved Addresses</h2>
        <p className="mb-0" style={{ opacity: 0.9 }}>
          Manage your delivery and billing locations
        </p>
      </div>

      <div className="container pb-5">
        {/* Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0" style={{ color: "var(--cart-text)" }}>
            Your Address Book
          </h5>
          {!showForm && (
            <button
              className="btn btn-accent px-4 py-2"
              onClick={() => setShowForm(true)}
            >
              + Add New Address
            </button>
          )}
        </div>

        {/* Address Form Toggle */}
        {showForm && (
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        )}

        {/* Address Grid */}
        <AddressList
          addresses={addresses}
          loading={loading}
          onDelete={(id) => setItemToDelete(id)}
        />
      </div>

      {/* Styled Confirmation Dialog */}
      {itemToDelete && (
        <div className="cart-dialog-backdrop" role="presentation">
          <div
            className="cart-remove-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-address-title"
          >
            <div className="cart-dialog-icon">📍</div>
            <h4 id="remove-address-title">Delete Address?</h4>
            <p>
              Are you sure you want to remove this address from your saved list?
            </p>

            <div className="cart-dialog-actions">
              <button
                className="btn cart-dialog-remove"
                disabled={deleting}
                onClick={confirmDeleteAddress}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className="btn cart-dialog-cancel"
                disabled={deleting}
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
