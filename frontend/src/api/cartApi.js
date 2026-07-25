import axios from "axios";
const BASE_URL = "http://localhost:8080/api/users";

export const getCart=async (userId)=>{
    const response=await axios.get(`${BASE_URL}/${userId}/cart`);
    return response.data;

}

// POST /api/users/{userId}/cart — add to cart (backend bumps quantity if product already in cart)
export const addToCart=async (userId,productId,quantity=1)=>{
    const response=await axios.post(`${BASE_URL}/${userId}/cart`, {
        productId, quantity,
    })

    return response.data;
}


// PATCH /api/users/{userId}/cart/{cartItemId}?quantity=X — update quantity of one cart row
export const updateQuantity=async (userId,cartItemId,quantity)=>{
  const response=await  axios.patch(`${BASE_URL}/${userId}/cart/${cartItemId}`,null,
        {params:{quantity}});
    return response.data;
}

// DELETE /api/users/{userId}/cart/{cartItemId} — remove one item
export const removeCartItem=async (userId,cartItemId)=>{
    await axios.delete(`${BASE_URL}/${userId}/cart/${cartItemId}`);
}

// DELETE /api/users/{userId}/cart — clear entire cart

export const clearCart= async (userId)=>{
    await axios.delete(`${BASE_URL}/${userId}/cart`);
}
