import axios from 'axios';
import { getToken, removeToken } from './jwt';
import { ApiError, handleApiError } from './apiError';
import { STORAGE_KEYS, removeItem } from './storage';
import { BASE_URL } from '../config';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = getToken();
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if needed (example with cookie)
    // const csrfToken = getCookie('csrftoken');
    // if (csrfToken) {
    //   config.headers['X-CSRFToken'] = csrfToken;
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  async (error) => {
    // Handle errors
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't already tried to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        // const refreshToken = getRefreshToken();
        // if (refreshToken) {
        //   const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        //   const { token } = response.data;
        //   
        //   // Save the new token
        //   setToken(token);
        //   
        //   // Retry the original request with the new token
        //   originalRequest.headers.Authorization = `Bearer ${token}`;
        //   return apiClient(originalRequest);
        // }
      } catch (refreshError) {
        // If refresh token fails, log the user out
        removeToken();
        removeItem(STORAGE_KEYS.AUTH);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(handleApiError(error));
  }
);

/**
 * Makes an API request
 * @param {Object} config - Axios request config
 * @returns {Promise<any>} The response data
 */
const request = async (config) => {
  try {
    const response = await apiClient({
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Makes a GET request
 * @param {string} url - The URL to request
 * @param {Object} params - Query parameters
 * @param {Object} headers - Custom headers
 * @returns {Promise<any>} The response data
 */
const get = (url, params = {}, headers = {}) => {
  return request({
    method: 'GET',
    url,
    params,
    headers,
  });
};

/**
 * Makes a POST request
 * @param {string} url - The URL to request
 * @param {Object} data - The request body
 * @param {Object} params - Query parameters
 * @param {Object} headers - Custom headers
 * @returns {Promise<any>} The response data
 */
const post = (url, data = {}, params = {}, headers = {}) => {
  return request({
    method: 'POST',
    url,
    data,
    params,
    headers,
  });
};

/**
 * Makes a PUT request
 * @param {string} url - The URL to request
 * @param {Object} data - The request body
 * @param {Object} params - Query parameters
 * @param {Object} headers - Custom headers
 * @returns {Promise<any>} The response data
 */
const put = (url, data = {}, params = {}, headers = {}) => {
  return request({
    method: 'PUT',
    url,
    data,
    params,
    headers,
  });
};

/**
 * Makes a PATCH request
 * @param {string} url - The URL to request
 * @param {Object} data - The request body
 * @param {Object} params - Query parameters
 * @param {Object} headers - Custom headers
 * @returns {Promise<any>} The response data
 */
const patch = (url, data = {}, params = {}, headers = {}) => {
  return request({
    method: 'PATCH',
    url,
    data,
    params,
    headers,
  });
};

/**
 * Makes a DELETE request
 * @param {string} url - The URL to request
 * @param {Object} params - Query parameters
 * @param {Object} headers - Custom headers
 * @returns {Promise<any>} The response data
 */
const del = (url, params = {}, headers = {}) => {
  return request({
    method: 'DELETE',
    url,
    params,
    headers,
  });
};

/**
 * Makes a request to upload a file
 * @param {string} url - The URL to upload to
 * @param {File} file - The file to upload
 * @param {Object} data - Additional form data
 * @param {Function} onUploadProgress - Progress callback
 * @param {Object} headers - Custom headers
 * @returns {Promise<any>} The response data
 */
const upload = (url, file, data = {}, onUploadProgress = null, headers = {}) => {
  const formData = new FormData();
  
  // Append the file
  formData.append('file', file);
  
  // Append additional data
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  
  return request({
    method: 'POST',
    url,
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

/**
 * Sets the authentication token
 * @param {string} token - The authentication token
 */
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Export the API client and utility functions
export {
  apiClient,
  request,
  get,
  post,
  put,
  patch,
  del,
  upload,
  setAuthToken,
};

export default {
  apiClient,
  request,
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  setAuthToken,
};
