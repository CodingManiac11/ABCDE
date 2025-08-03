import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
    
  getProfile: () => api.get('/users/profile'),
};

export const itemsAPI = {
  // Get all products/items
  getItems: () => api.get('/products'),
  // Get single product/item by ID
  getItem: (id) => api.get(`/products/${id}`),
  // Create new product (admin only)
  createItem: (productData) => api.post('/products', productData),
  // Update product (admin only)
  updateItem: (id, productData) => api.put(`/products/${id}`, productData),
  // Delete product (admin only)
  deleteItem: (id) => api.delete(`/products/${id}`)
};

export const cartAPI = {
  // Add item to cart
  addToCart: (productId, quantity = 1) => 
    api.post('/cart', { productId, quantity }),
  // Get user's cart
  getCart: () => api.get('/cart'),
  // Update cart item quantity
  updateCartItem: (productId, quantity) => 
    api.put(`/cart/${productId}`, { quantity }),
  // Remove item from cart
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  // Clear cart
  clearCart: () => api.delete('/cart')
};

export const ordersAPI = {
  // Create new order from cart
  createOrder: (orderData) => api.post('/orders', orderData),
  // Get user's orders
  getMyOrders: () => api.get('/orders/myorders'),
  // Get order by ID
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  // Update order to paid
  updateOrderToPaid: (orderId, paymentResult) => 
    api.put(`/orders/${orderId}/pay`, paymentResult),
  // Get all orders (admin only)
  getAllOrders: () => api.get('/orders')
};

export default api;
