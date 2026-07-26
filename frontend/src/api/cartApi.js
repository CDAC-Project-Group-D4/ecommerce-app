import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/cart"
});

// Add JWT token to every cart request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// GET /api/cart — userId no longer needed, backend reads it from the JWT
export const getCart = async () => {
    const response = await api.get("");
    return response.data;
};

// POST /api/cart — add product to cart
export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post("", {
        productId,
        quantity
    });

    return response.data;
};

// PATCH /api/cart/{cartItemId} — update quantity
export const updateQuantity = async (cartItemId, quantity) => {
    const response = await api.patch(
        `/${cartItemId}`,
        null,
        {
            params: { quantity }
        }
    );

    return response.data;
};

// DELETE /api/cart/{cartItemId} — remove one item
export const removeCartItem = async (cartItemId) => {
    await api.delete(`/${cartItemId}`);
};

// DELETE /api/cart — clear entire cart
export const clearCart = async () => {
    await api.delete("");
};
