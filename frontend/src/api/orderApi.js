import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/orders"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("jwtToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

// Get all orders
export const getOrders = async () => {

    const response = await api.get("");

    return response.data;

};

// Get single order
export const getOrder = async (orderId) => {

    const response = await api.get(`/${orderId}`);

    return response.data;

};

// Cancel Order
export const cancelOrder = async (orderId) => {

    const response = await api.patch(`/${orderId}/cancel`);

    return response.data;

};

// Cancel one item from an order
export const cancelOrderItem = async (orderId, orderItemId) => {

    const response = await api.patch(`/${orderId}/items/${orderItemId}/cancel`);

    return response.data;

};
