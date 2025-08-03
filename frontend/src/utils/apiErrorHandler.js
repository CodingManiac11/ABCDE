/**
 * API Error Handler Utility
 * 
 * This utility provides consistent error handling for API responses.
 * It parses error responses and extracts meaningful error messages.
 */

/**
 * Error codes and their corresponding user-friendly messages
 */
const ERROR_MESSAGES = {
  // 4xx Client Errors
  400: 'Bad Request - The request was invalid or cannot be processed',
  401: 'Unauthorized - Authentication is required',
  403: 'Forbidden - You do not have permission to access this resource',
  404: 'Not Found - The requested resource was not found',
  409: 'Conflict - The request conflicts with the current state of the server',
  422: 'Validation Error - The request data is invalid',
  
  // 5xx Server Errors
  500: 'Internal Server Error - Something went wrong on our end',
  502: 'Bad Gateway - The server received an invalid response',
  503: 'Service Unavailable - The server is currently unavailable',
  504: 'Gateway Timeout - The server did not receive a timely response',
  
  // Network Errors
  NETWORK_ERROR: 'Network Error - Please check your internet connection',
  TIMEOUT: 'Request Timeout - The request took too long to complete',
  
  // Default
  DEFAULT: 'An unexpected error occurred',
};

/**
 * Extracts error message from an error object or response
 * @param {Error|Object} error - The error object or response
 * @returns {string} The error message
 */
export const getErrorMessage = (error) => {
  // Handle network errors
  if (!error) {
    return ERROR_MESSAGES.DEFAULT;
  }
  
  // Handle Axios error response
  if (error.isAxiosError) {
    // Network error (no response from server)
    if (!error.response) {
      return error.message === 'Network Error' 
        ? ERROR_MESSAGES.NETWORK_ERROR 
        : error.message || ERROR_MESSAGES.DEFAULT;
    }
    
    const { status, data } = error.response;
    
    // Handle specific status codes
    if (status === 401) {
      return ERROR_MESSAGES[401];
    }
    
    // Try to get error message from response data
    if (data) {
      // Handle validation errors (422)
      if (status === 422 && data.errors) {
        return Object.values(data.errors)
          .flat()
          .join(' ');
      }
      
      // Handle custom error messages from API
      if (data.message) {
        return data.message;
      }
      
      // Handle JWT errors
      if (data.error && data.error.includes('jwt')) {
        return 'Your session has expired. Please log in again.';
      }
    }
    
    // Return status-specific message if available
    return ERROR_MESSAGES[status] || error.message || ERROR_MESSAGES.DEFAULT;
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.DEFAULT;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle error objects with message property
  if (error.message) {
    return error.message;
  }
  
  // Default fallback
  return ERROR_MESSAGES.DEFAULT;
};

/**
 * Handles API errors and displays them to the user
 * @param {Error|Object} error - The error object or response
 * @param {Function} [showError] - Function to display error message (e.g., toast, alert)
 * @returns {string} The error message
 */
export const handleApiError = (error, showError) => {
  const errorMessage = getErrorMessage(error);
  
  if (showError && typeof showError === 'function') {
    showError(errorMessage);
  }
  
  // Log the error for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', error);
  }
  
  return errorMessage;
};

/**
 * Creates an error object with a consistent structure
 * @param {string|Object} error - The error message or error object
 * @param {string} [code] - Optional error code
 * @returns {Object} Standardized error object
 */
export const createError = (error, code) => {
  if (typeof error === 'string') {
    return {
      message: error,
      code: code || 'ERROR',
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    message: error.message || ERROR_MESSAGES.DEFAULT,
    code: code || error.code || 'ERROR',
    details: error.details || error.errors || null,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handles API response and returns data or throws an error
 * @param {Promise} promise - The API promise
 * @returns {Promise} Resolves with data or rejects with error
 */
export const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const errorWithMessage = new Error(errorMessage);
    
    // Preserve original error details
    if (error.response) {
      errorWithMessage.response = error.response;
      errorWithMessage.status = error.response.status;
    }
    
    throw errorWithMessage;
  }
};

/**
 * Handles API errors with retry logic
 * @param {Function} apiCall - The API call function
 * @param {number} [maxRetries=3] - Maximum number of retry attempts
 * @param {number} [retryDelay=1000] - Delay between retries in milliseconds
 * @returns {Promise} The API response
 */
export const withRetry = async (apiCall, maxRetries = 3, retryDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      lastError = error;
      
      // Don't retry for 4xx errors (except 429 Too Many Requests)
      if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
        break;
      }
      
      // Exponential backoff
      const delay = retryDelay * Math.pow(2, attempt - 1);
      
      // Add a small random delay to avoid thundering herd problem
      const jitter = Math.random() * 1000;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }
  
  throw lastError;
};

export default {
  getErrorMessage,
  handleApiError,
  createError,
  handleResponse,
  withRetry,
};
