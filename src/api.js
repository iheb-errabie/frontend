import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Update with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Advertisement API
export const fetchAdvertisements = async () => api.get('/advertisements');
export const fetchAdvertisementById = async (id) => api.get(`/advertisements/${id}`);
export const createAdvertisement = async (data) => api.post('/advertisements', data);
export const updateAdvertisement = async (id, data) => api.put(`/advertisements/${id}`, data);
export const deleteAdvertisement = async (id) => api.delete(`/advertisements/${id}`);
export const approveAdvertisement = async (id) => api.put(`/advertisements/${id}/approve`);

// Product API
export const fetchProductsByVendor = async (vendorId) => api.get(`/products/vendor/${vendorId}`);

// Cart API
export const fetchCart = async () => api.get('/users/cart');
export const addToCart = async (data) => api.post('/users/cart', data);
export const removeFromCart = async (productId) => api.delete(`/users/cart/${productId}`);

export const confirmOrder = async () => api.post('/users/cart/confirm-order');

// Review API

export const fetchReviews = async (productId) => api.get(`/products/${productId}/reviews`);
export const addReview = async (productId, data) => api.post(`/products/${productId}/reviews`, data);
export const updateReview = async (productId, reviewId, data) => api.put(`/products/${productId}/reviews/${reviewId}`, data); 

export default api;
// wish list API
export const getWishlist = () => api.get("/users/wishlist");
export const addToWishlist = (productId) => api.post("/users/wishlist/add", { productId });
export const removeFromWishlist = (productId) => api.post("/users/wishlist/remove", { productId });