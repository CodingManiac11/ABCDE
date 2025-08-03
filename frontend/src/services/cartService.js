import axios from 'axios';
import { API_URL } from '../config';

// Get user's cart
const getCart = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${API_URL}/api/v1/cart`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return an empty cart structure if there's an error
    return {
      success: false,
      data: {
        items: [],
        total: 0
      }
    };
  }
};

// Add item to cart
const addToCart = async (productId, qty, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/v1/cart`,
    { productId, quantity: qty },
    config
  );
  return response.data;
};

// Update cart item quantity
const updateCartItem = async (itemId, qty, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/cart/${itemId}`,
    { quantity: qty },
    config
  );
  return response.data;
};

// Remove item from cart
const removeFromCart = async (itemId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    `${API_URL}/api/v1/cart/${itemId}`,
    config
  );
  return response.data;
};

// Clear cart
const clearCart = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/api/v1/cart`, config);
  return response.data;
};

// Apply coupon
const applyCoupon = async (couponCode, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/v1/cart/apply-coupon`,
    { code: couponCode },
    config
  );
  return response.data;
};

// Remove coupon
const removeCoupon = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    `${API_URL}/api/v1/cart/remove-coupon`,
    config
  );
  return response.data;
};

// Calculate shipping
const calculateShipping = async (address, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/v1/cart/calculate-shipping`,
    address,
    config
  );
  return response.data;
};

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  calculateShipping,
};

export default cartService;
