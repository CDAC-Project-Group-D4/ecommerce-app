import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const createReturnRequest = async (payload) => {
    const response = await api.post("/returns", payload);
    return response.data;
};

export const getMyReturns = async () => {
    const response = await api.get("/returns");
    return response.data;
};

export const getSellerReturns = async () => {
    const response = await api.get("/seller/returns");
    return response.data;
};

export const decideSellerReturn = async (returnRequestId, decision, notes) => {
    const response = await api.patch(
        `/seller/returns/${returnRequestId}/decision`,
        { decision, notes }
    );
    return response.data;
};
