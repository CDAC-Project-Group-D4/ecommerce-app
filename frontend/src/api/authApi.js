import axios from "axios";
axios.defaults.withCredentials = true;

const BASE_URL = "http://localhost:8080/api/auth";

// signup api
export const signupUser = async (signupData) => {
    const response = await axios.post(`${BASE_URL}/signup`, signupData);
    return response.data;
};

// signin api
export const signinUser = async (signinData) => {
    const response = await axios.post(`${BASE_URL}/signin`, signinData);
    return response.data;
};

// signout api
export const signoutUser = async () => {
    const response = await axios.post(`${BASE_URL}/signout`);
    return response.data;
};
