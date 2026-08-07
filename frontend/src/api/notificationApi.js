import axios from "axios";
axios.defaults.withCredentials = true;

const BASE_URL = "http://localhost:8080/api/store/notifications";

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

export const getSellerNotifications = async () => {
    try {
        const response = await axios.get(BASE_URL, getAuthHeader());
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
};

export const createNotification = async (notificationData) => {
    try {
        const response = await axios.post(BASE_URL, notificationData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create notification");
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}/read`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to mark notification as read");
    }
};

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.put(`${BASE_URL}/read-all`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
    }
};
