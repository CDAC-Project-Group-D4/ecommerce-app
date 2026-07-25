import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/users"
});

// Add JWT token to every cart request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getCart = async (userId) => {
    const response = await api.get(`/${userId}/cart`);
    return response.data;
};

// Add product to cart
export const addToCart = async (userId, productId, quantity = 1) => {
    const response = await api.post(`/${userId}/cart`, {
        productId,
        quantity
    });

    return response.data;
};

// Update cart quantity
export const updateQuantity = async (
    userId,
    cartItemId,
    quantity
) => {
    const response = await api.patch(
        `/${userId}/cart/${cartItemId}`,
        null,
        {
            params: { quantity }
        }
    );

    return response.data;
};

// Remove one cart item
export const removeCartItem = async (userId, cartItemId) => {
    await api.delete(`/${userId}/cart/${cartItemId}`);
};

// Clear the complete cart
export const clearCart = async (userId) => {
    await api.delete(`/${userId}/cart`);
};