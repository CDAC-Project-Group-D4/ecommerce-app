import api from "./axiosInstance";

export const sendAIChatQuery = async (query) => {
    const response = await api.post("/ai/chat", { query });
    return response;
};
