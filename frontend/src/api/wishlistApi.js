import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/wishlist"
});

// Add JWT token to every wishlist request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// GET /api/wishlist — list wishlist items
export const getWishlist = async () => {
    const response = await api.get("");
    return response.data;
};

// POST /api/wishlist — add product to wishlist
export const addToWishlist = async (productId) => {
    const response = await api.post("", { productId });
    return response.data;
};

// DELETE /api/wishlist/{wishlistItemId} — remove one item
export const removeWishlistItem = async (wishlistItemId) => {
    await api.delete(`/${wishlistItemId}`);
};

// POST /api/wishlist/{wishlistItemId}/move-to-cart
export const moveToCart = async (wishlistItemId) => {
    const response = await api.post(`/${wishlistItemId}/move-to-cart`);
    return response.data;
};
