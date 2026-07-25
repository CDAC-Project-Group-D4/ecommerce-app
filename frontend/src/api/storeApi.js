import axios from "axios";
const BASE_URL = "http://localhost:8080/api/store";

// ✅ Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// create store api
export const createStore = async (storeData) => {
    const response = await axios.post(`${BASE_URL}/create-store`, storeData, getAuthHeader());
    return response.data;
};

// get store api
export const getMyStore = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/get-store`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Store not found" };
    }
};

// update store api
export const updateStore = async (storeData) => {
    const response = await axios.put(`${BASE_URL}/update-store`, storeData,getAuthHeader());
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
    const response = await axios.post(`${BASE_URL}/upload-media`, formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return response.data;
};