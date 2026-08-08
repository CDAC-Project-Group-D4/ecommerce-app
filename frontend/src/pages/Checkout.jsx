import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCheckout } from "../context/CheckoutContext";
import Navbar from "../components/Navbar"; 

import CheckoutHeader from "../components/customerComponents/checkout/CheckoutHeader";
import AddressSection from "../components/customerComponents/checkout/AddressSection";
import PaymentSection from "../components/customerComponents/checkout/PaymentSection";
import OrderSummary from "../components/customerComponents/checkout/OrderSummary";
import PlaceOrderButton from "../components/customerComponents/checkout/PlaceOrderButton";

import "../css/Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    addresses,

    subtotal,
    grandTotal,

    selectedAddress,
    paymentMethod,

    loading,
    savingAddress,
    error,

    loadCheckout,
    handleAddAddress,
    handlePlaceOrder,

    setSelectedAddress,
    setPaymentMethod,
  } = useCheckout();

  useEffect(() => {
    loadCheckout();
  }, [loadCheckout]);

  const placeOrder = async () => {
    const order = await handlePlaceOrder();

    if (order) {
      navigate("/order-success", {
        state: {
          orderId: order.orderId,
        },
      });
    }
  };

  return (
    <div style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
      {/* 👈 Renders Navbar at the top of the Checkout page */}
      <Navbar />

      <div className="checkout-page">
        <CheckoutHeader />

        {/* Keep Navbar visible while loading */}
        {loading ? (
          <div className="loading-container text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <h2 className="mt-3">Loading Checkout...</h2>
          </div>
        ) : (
          <div className="container py-4">
            <div className="row g-4">
              {/* Left Side */}
              <div className="col-lg-8">
                <AddressSection
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                  savingAddress={savingAddress}
                  onAddAddress={handleAddAddress}
                />

                <PaymentSection
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>

              {/* Right Side */}
              <div className="col-lg-4">
                <div className="checkout-sidebar">
                  <OrderSummary
                    cartItems={cartItems}
                    subtotal={subtotal}
                    grandTotal={grandTotal}
                  />

                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}

                  <PlaceOrderButton
                    loading={loading}
                    handlePlaceOrder={placeOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;