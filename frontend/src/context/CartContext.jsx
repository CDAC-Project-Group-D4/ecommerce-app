import {createContext, useCallback, useContext, useState} from "react";
import {
    getCart,
    addToCart as addToCartApi,
    updateQuantity as updateCartQuantityApi,
    removeCartItem as removeCartItemApi,
    clearCart as clearCartApi,
} from "../api/cartApi";

const CartContext = createContext(null);

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getCart();

            setCartItems(data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Please sign in to view your cart");
            } else {
                setError(err.message || "Failed to fetch cart");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddToCart = async (productId, quantity = 1) => {
        try {
            await addToCartApi(productId, quantity);
            await refreshCart();
        } catch (err) {
            console.error(err);
            setError("Failed to add item to cart");
        }
    };

    const handleUpdateQuantity = async (cartItemId, quantity) => {
        try {
            await updateCartQuantityApi(cartItemId, quantity);
            await refreshCart();
        } catch (err) {
            console.error("Update Error:", err);
            console.log(err.response?.data);
            console.log(err.response?.status);
            setError("Failed to update quantity");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeCartItemApi(cartItemId);
            await refreshCart();
        } catch (err) {
            console.error("Remove Error:", err);
            console.log(err.response?.data);
            console.log(err.response?.status);
            setError("Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCartApi();
            setCartItems([]);
        } catch (err) {
            console.error(err);
            setError("Failed to clear cart");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,
                refreshCart,
                handleAddToCart,
                handleUpdateQuantity,
                handleRemoveItem,
                handleClearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
