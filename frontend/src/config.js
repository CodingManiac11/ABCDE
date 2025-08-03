/**
 * Application Configuration
 * 
 * This file contains all the configuration settings for the application.
 * It includes API URLs, theme settings, and other application-wide constants.
 */

// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  CART_ITEMS: 'cartItems',
  SHIPPING_ADDRESS: 'shippingAddress',
  PAYMENT_METHOD: 'paymentMethod',
  THEME: 'theme',
  TOKEN: 'token',
};

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  DEFAULT: 'light',
};

// Pagination Settings
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  PAGE_RANGE_DISPLAYED: 5,
  MARGIN_PAGES_DISPLAYED: 1,
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PASSWORD: 'Password must be at least 6 characters long',
  PASSWORD_MATCH: 'Passwords do not match',
  PRICE: 'Please enter a valid price',
  QUANTITY: 'Please enter a valid quantity',
  RATING: 'Please select a rating between 1 and 5',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  DEFAULT: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  PRODUCT_ADDED: 'Product added successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  REVIEW_ADDED: 'Review added successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_PAID: 'Order paid successfully',
  ORDER_DELIVERED: 'Order delivered successfully',
  CART_UPDATED: 'Cart updated successfully',
  ADDRESS_ADDED: 'Address added successfully',
  ADDRESS_UPDATED: 'Address updated successfully',
  ADDRESS_DELETED: 'Address deleted successfully',
  PAYMENT_METHOD_ADDED: 'Payment method added successfully',
  PAYMENT_METHOD_DELETED: 'Payment method deleted successfully',
};

// Date & Time Formats
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'dddd, MMMM DD, YYYY',
  TIME: 'h:mm A',
  DATETIME: 'MM/DD/YYYY h:mm A',
};

// Currency Configuration
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'en-US',
  DECIMALS: 2,
  THOUSAND_SEPARATOR: ',',
  DECIMAL_SEPARATOR: '.',
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

// Feature Flags
export const FEATURES = {
  ENABLE_REVIEWS: true,
  ENABLE_WISHLIST: true,
  ENABLE_COUPONS: false,
  ENABLE_GUEST_CHECKOUT: true,
  ENABLE_MULTIPLE_ADDRESSES: true,
  ENABLE_PAYMENT_METHODS: true,
};

// Export all configurations as a single object
export default {
  API_URL,
  LOCAL_STORAGE_KEYS,
  THEME,
  PAGINATION,
  VALIDATION_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  CURRENCY,
  FILE_UPLOAD,
  FEATURES,
};
