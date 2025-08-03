import axios from 'axios';
import { API_URL } from '../config';

// Create new order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/v1/orders`,
    orderData,
    config
  );
  return response.data;
};

// Get order by ID
const getOrderById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/api/v1/orders/${id}`,
    config
  );
  return response.data;
};

// Pay for order
const payOrder = async (orderId, paymentResult, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/orders/${orderId}/pay`,
    paymentResult,
    config
  );
  return response.data;
};

// Get logged in user orders
const getMyOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/api/v1/orders/myorders`,
    config
  );
  return response.data;
};

// Get all orders (admin)
const getOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/api/v1/orders`,
    config
  );
  return response.data;
};

// Update order to delivered (admin)
const updateOrderToDelivered = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/orders/${orderId}/deliver`,
    {},
    config
  );
  return response.data;
};

// Update order status (admin)
const updateOrderStatus = async (orderId, status, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/orders/${orderId}/status`,
    { status },
    config
  );
  return response.data;
};

// Get order analytics (admin)
const getOrderAnalytics = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/api/v1/orders/analytics`,
    config
  );
  return response.data;
};

// Get monthly sales (admin)
const getMonthlySales = async (year, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/api/v1/orders/monthly-sales?year=${year}`,
    config
  );
  return response.data;
};

const orderService = {
  createOrder,
  getOrderById,
  payOrder,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrderAnalytics,
  getMonthlySales,
};

export default orderService;
