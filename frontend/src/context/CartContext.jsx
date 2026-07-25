import {createContext, useCallback, useContext, useState} from "react";
import {getCurrentUserId} from "../utils/authhelper.js";
import {
    getCart,
    addToCart as addToCartApi,
    updateQuantity as updateCartQuantityApi,
    removeCartItem as removeCartItemApi,
    clearCart as clearCartApi,
} from "../api/cartApi";

const CartContext= createContext(null);

export const CartProvider=({children})=>{
    const [cartItems,setCartItems]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);

    const refreshCart = useCallback(async () => {

        const userId = getCurrentUserId();

        if (!userId) {
            setCartItems([]);
            return;
        }
        try {

            setLoading(true);
            setError(null);

            const data = await getCart(userId);

            setCartItems(data);
        } catch (err) {

            console.error(err);
            setError(err.message || "Failed to fetch cart");

        } finally {

            setLoading(false);

        }

    }, []);

    const handleAddToCart = async (productId,quantity=1)=>{
        const userId = getCurrentUserId();
        if(!userId){
            return;
        }
        try{

            await addToCartApi(userId,productId,quantity);
            await refreshCart();
        }catch (err){
            console.error(err);
            setError( "Failed to add item to cart");
        }
    };

    const handleUpdateQuantity = async (cartItemId, quantity) => {

        const userId = getCurrentUserId();

        if (!userId) return;

        try {

            await updateCartQuantityApi(userId, cartItemId, quantity);

            await refreshCart();

        } catch (err) {

            console.error("Update Error:", err);
            console.log(err.response);
            console.log(err.response?.data);
            console.log(err.response?.status);

            setError("Failed to update quantity");
        }
    };
    const handleRemoveItem = async (cartItemId) => {

        const userId = getCurrentUserId();

        if (!userId) return;

        try {

            await removeCartItemApi(userId, cartItemId);

            await refreshCart();

        } catch (err) {
            console.error("Remove Error:", err);
            console.log(err.response);
            console.log(err.response?.data);
            console.log(err.response?.status);

            setError("Failed to remove item");
        }
    };

    const handleClearCart = async () => {

        const userId = getCurrentUserId();

        if (!userId) return;

        try {

            await clearCartApi(userId);

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

}
export const useCart = () => {
    return useContext(CartContext);
};