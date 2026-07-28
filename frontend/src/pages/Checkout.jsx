import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCheckout } from "../context/CheckoutContext";

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
        error,

        loadCheckout,
        handlePlaceOrder,

        setSelectedAddress,
        setPaymentMethod

    } = useCheckout();

    useEffect(() => {

        loadCheckout();

    }, [loadCheckout]);

    const placeOrder = async () => {

        const order = await handlePlaceOrder();

        if (order) {

            navigate("/orders");

        }

    };

    if (loading) {

        return (

            <div className="loading-container">

                <h2>Loading Checkout...</h2>

            </div>

        );

    }

    return (

        <div className="checkout-page">

            <CheckoutHeader />

            <div className="container py-4">

                <div className="row g-4">

                    {/* Left Side */}

                    <div className="col-lg-8">

                        <AddressSection
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                        />

                        <PaymentSection
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                        />

                    </div>

                    {/* Right Side */}

                    <div className="col-lg-4">

                        <OrderSummary
                            cartItems={cartItems}
                            subtotal={subtotal}
                            grandTotal={grandTotal}
                        />

                        {
                            error &&
                            <div className="alert alert-danger mt-3">
                                {error}
                            </div>
                        }

                        <PlaceOrderButton
                            loading={loading}
                            handlePlaceOrder={placeOrder}
                        />

                    </div>

                </div>

            </div>
        </div>

    );

}

export default Checkout;