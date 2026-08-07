import api from './axiosInstance';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const catalogApi = {
  getProducts: ({ categoryId, search, sort = 'id', page = 0, size = 10, ...dynamicFilters }) => {
    const params = { page, size };

    if (categoryId) params.categoryId = categoryId;
    if (search && search.trim() !== '') params.search = search;
    if (sort) params.sort = sort;

    return api.get('/v1/products', { 
      params : { ...params, ...dynamicFilters}
     });
  },

  getCategories: () => api.get('/v1/categories'),

  getCategoryAttributes: (categoryId) => api.get(`/v1/categories/${categoryId}/attributes`),
  
  getProductById: (id) => api.get(`/v1/products/${id}`),
  getProductReviews: (id, params) => api.get(`/v1/products/${id}/reviews`, { params }),
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/${itemId}`),
};

export const orderApi = {
  reviewCheckout: (cartItemIds) => api.post('/orders/checkout/review', { cartItemIds }),
  placeOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
};

export const customerAccountApi = {
  getAddresses: () => api.get('/customer/address'),
  addAddress: (data) => api.post('/customer/address', data),
  deleteAddress: (id) => api.delete(`/customer/address/${id}`),
};