import axios from "axios";

const reviewApi = axios.create({
    baseURL: "http://localhost:8080/api/reviews"
});

reviewApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const createReview = async (reviewData) => {
    const response = await reviewApi.post("", reviewData);
    return response.data;
};

export const getMyReviews = async () => {
    const response = await reviewApi.get("/my-reviews");
    return response.data;
};
