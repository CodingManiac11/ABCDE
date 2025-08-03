import axios from 'axios';
import { API_URL } from '../config';

// Get all products
const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}/api/v1/products?${queryString}`);
  return response.data;
};

// Get single product
const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/api/v1/products/${id}`);
  return response.data;
};

// Create product (admin only)
const createProduct = async (productData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/v1/products`,
    productData,
    config
  );
  return response.data;
};

// Update product (admin only)
const updateProduct = async (id, productData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/products/${id}`,
    productData,
    config
  );
  return response.data;
};

// Delete product (admin only)
const deleteProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    `${API_URL}/api/v1/products/${id}`,
    config
  );
  return response.data;
};

// Upload product image
const uploadProductImage = async (id, file, token) => {
  const formData = new FormData();
  formData.append('image', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/products/${id}/image`,
    formData,
    config
  );
  return response.data;
};

// Create product review
const createProductReview = async (productId, reviewData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}/api/v1/products/${productId}/reviews`,
    reviewData,
    config
  );
  return response.data;
};

// Get top rated products
const getTopProducts = async () => {
  const response = await axios.get(`${API_URL}/api/v1/products/top`);
  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  createProductReview,
  getTopProducts,
};

export default productService;
