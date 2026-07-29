import axios from "axios";
axios.defaults.withCredentials = true;

const BASE_URL = "http://localhost:8080/api/store";

// get token header helper
const getAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return {
        withCredentials: true,
        headers
    };
};

// create store api
export const createStore = async (storeData) => {
    const response = await axios.post(`${BASE_URL}/create-store`, storeData, getAuthHeader());
    return response.data;
};

// get store api
export const getMyStore = async () => {
    const response = await axios.get(`${BASE_URL}/get-store`, getAuthHeader());
    return response.data;
};

// update store api
export const updateStore = async (storeData) => {
    const response = await axios.put(`${BASE_URL}/update-store`, storeData, getAuthHeader());
    return response.data;
};

// delete store api
export const deleteStore = async () => {
    const response = await axios.delete(`${BASE_URL}/delete-store`, getAuthHeader());
    return response.data;
};

// upload Banner + Profile Photo api
export const uploadStoreMedia = async (formData) => {
    const token = localStorage.getItem("jwtToken");
    const headers = { "Content-Type": "multipart/form-data" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await axios.post(`${BASE_URL}/upload-media`, formData, {
        withCredentials: true,
        headers
    });
    return response.data;
};

// get store orders api
export const getStoreOrders = async () => {
    const response = await axios.get(`${BASE_URL}/orders`, getAuthHeader());
    return response.data;
};

//deactivate store (soft delete) api
export const deactivateStore = async () => {
    const response = await axios.put(`${BASE_URL}/deactivate-store`, {}, getAuthHeader());
    return response.data;
}

//reactivate store api
export const reactivateStore = async () => {
    const response = await axios.put(`${BASE_URL}/reactivate-store`, {}, getAuthHeader());
    return response.data;
}