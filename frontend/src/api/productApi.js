import axios from "axios";

const BASE_URL = "http://localhost:8080/api/product";

//get token
const getAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get all products linked to seller's store
export const getStoreProducts = async () => {
    const response = await axios.get(`${BASE_URL}/get-product`, getAuthHeader());
    return response.data;
};

// Create a new product for seller's store
export const createProduct = async (productData) => {
    const response = await axios.post(`${BASE_URL}/create-product`, productData, getAuthHeader());
    return response.data;
};

// Update existing product
export const updateProduct = async (productId, updateData) => {
    const response = await axios.put(`${BASE_URL}/update-product/${productId}`, updateData, getAuthHeader());
    return response.data;
};

// Delete product - soft delete
export const deleteProduct = async (productId) => {
    const response = await axios.delete(`${BASE_URL}/delete-product/${productId}`, getAuthHeader());
    return response.data;
};
