import axios from 'axios';
import { API_URL } from '../config';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/v1/auth/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Update profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/auth/me`,
    userData,
    config
  );

  if (response.data) {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        ...response.data,
      })
    );
  }

  return response.data;
};

// Update password
const updatePassword = async (passwords, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/api/v1/auth/updatepassword`,
    passwords,
    config
  );

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  updatePassword,
};

export default authService;
