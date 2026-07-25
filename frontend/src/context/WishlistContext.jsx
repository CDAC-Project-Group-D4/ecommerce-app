import {createContext, useCallback, useContext, useState} from "react";
import {
    getWishlist,
    addToWishlist as addToWishlistApi,
    removeWishlistItem as removeWishlistItemApi,
    moveToCart as moveToCartApi,
} from "../api/wishlistApi";

const WishlistContext = createContext(null);

export const WishlistProvider = ({children}) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getWishlist();

            setWishlistItems(data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Please sign in to view your wishlist");
            } else {
                setError(err.message || "Failed to fetch wishlist");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddToWishlist = async (productId) => {
        try {
            await addToWishlistApi(productId);
            await refreshWishlist();
            return true;
        } catch (err) {
            console.error(err);
            setError("Failed to add item to wishlist");
            return false;
        }
    };

    const handleRemoveItem = async (wishlistItemId) => {
        try {
            await removeWishlistItemApi(wishlistItemId);
            await refreshWishlist();
        } catch (err) {
            console.error("Remove Error:", err);
            console.log(err.response?.data);
            console.log(err.response?.status);
            setError("Failed to remove item");
        }
    };

    // Moves item to cart AND removes it from wishlist (backend handles both atomically).
    // Returns the cart response so the caller can show a confirmation if desired.
    const handleMoveToCart = async (wishlistItemId) => {
        try {
            const cartResponse = await moveToCartApi(wishlistItemId);
            await refreshWishlist();
            return cartResponse;
        } catch (err) {
            console.error("Move to Cart Error:", err);
            console.log(err.response?.data);
            console.log(err.response?.status);
            // Product may be out of stock/inactive — surface the backend's actual message
            setError(err.response?.data?.message || "Failed to move item to cart");
            return null;
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                loading,
                error,
                refreshWishlist,
                handleAddToWishlist,
                handleRemoveItem,
                handleMoveToCart
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    return useContext(WishlistContext);
};
