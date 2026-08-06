import api from './axiosInstance';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials), // Public[cite: 1]
  register: (data) => api.post('/auth/register', data), // Public[cite: 1]
  getMe: () => api.get('/auth/me'),
};



export const catalogApi = {
  getProducts: ({ categoryId, search, sort = 'id', page = 0, size = 10 }) => {
    // 🔑 Create clean params object
    const params = { page, size };

    if (categoryId) params.categoryId = categoryId;
    if (search && search.trim() !== '') params.search = search;
    if (sort) params.sort = sort;

    return api.get('/v1/products', { params });
  },

  getCategories: () => api.get('/v1/categories'),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/${itemId}`),
};

export const orderApi = {
  reviewCheckout: (cartItemIds) => api.post('/orders/checkout/review', { cartItemIds }), // Order preview[cite: 1]
  placeOrder: (orderData) => api.post('/orders', orderData), // COD / Online checkout[cite: 1]
  getOrders: () => api.get('/orders'),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
};