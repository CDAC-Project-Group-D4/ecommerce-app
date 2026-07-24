import axios from "axios";
const BASE_URL= "http://localhost:8080/api/auth";

//signup api
export const signupUser = async (signupData) => {
    const response = await axios.post(`${BASE_URL}/signup`, signupData);
    return response.data;
}

//signin api
export const signinUser = async (signinData) => {
    const response = await axios.post(`${BASE_URL}/signin`, signinData);
    return response.data;
} 

