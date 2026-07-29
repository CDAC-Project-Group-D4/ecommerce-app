import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// GET /api/checkout
export const getCheckout = async () => {
    const response = await api.get("/checkout");
    return response.data;
};

export const addCheckoutAddress = async (addressData) => {
    const response = await api.post("/checkout/addresses", addressData);
    return response.data;
};

// POST /api/orders
export const placeOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
};
