import { createContext, useCallback, useContext, useState } from "react";
import {
    addCheckoutAddress,
    getCheckout,
    placeOrder
} from "../api/checkoutApi";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const [subtotal, setSubtotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");

    const [loading, setLoading] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [error, setError] = useState("");

    // Load Checkout Data
    const loadCheckout = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getCheckout();

            setCartItems(data.cartItems);
            setAddresses(data.addresses);
            setSubtotal(data.subtotal);
            setGrandTotal(data.grandTotal);

        } catch (err) {

            setError("Failed to load checkout.");

        } finally {

            setLoading(false);

        }

    }, []);

    const handleAddAddress = async (addressData) => {
        try {
            setSavingAddress(true);
            setError("");

            const newAddress = await addCheckoutAddress(addressData);

            setAddresses((currentAddresses) => [
                ...currentAddresses,
                newAddress
            ]);
            setSelectedAddress(newAddress.id);

            return true;
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to save delivery address."
            );
            return false;
        } finally {
            setSavingAddress(false);
        }
    };

    // Place Order
    const handlePlaceOrder = async () => {

        try {

            if (!selectedAddress) {
                setError( "Please select a delivery address.");
                return;
            }

            setLoading(true);

            const order = await placeOrder({

                addressId: selectedAddress,
                paymentMethod

            });

            return order;

        } catch (err) {

            setError("Failed to place order.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <CheckoutContext.Provider
            value={{

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
                setPaymentMethod

            }}
        >

            {children}

        </CheckoutContext.Provider>

    );

};

export const useCheckout = () => useContext(CheckoutContext);
