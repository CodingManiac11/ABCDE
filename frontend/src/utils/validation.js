/**
 * Form Validation Utility
 * 
 * Provides common validation functions and error messages for form fields.
 * Supports validation for required fields, email, password, matching fields, etc.
 */

// Common validation patterns
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email validation
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // International phone numbers
  ZIP_CODE: /^\d{5}(-\d{4})?$/, // US ZIP code format
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, // URL format
  CREDIT_CARD: /^\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}$/, // Basic credit card format
  EXPIRY_DATE: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, // MM/YY format
  CVC: /^\d{3,4}$/, // 3 or 4 digit CVC
};

// Default error messages
const MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ZIP_CODE: 'Please enter a valid ZIP code',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_CREDIT_CARD: 'Please enter a valid credit card number',
  INVALID_EXPIRY_DATE: 'Please enter a valid expiration date (MM/YY)',
  INVALID_CVC: 'Please enter a valid CVC',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min) => `Must be at least ${min}`,
  MAX_VALUE: (max) => `Must be no more than ${max}`,
  BETWEEN: (min, max) => `Must be between ${min} and ${max}`,
  INVALID_CHOICE: 'Please select a valid option',
};

/**
 * Validates that a value is not empty
 * @param {string} value - The value to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const required = (value) => {
  if (!value && value !== 0) return MESSAGES.REQUIRED;
  if (typeof value === 'string' && !value.trim()) return MESSAGES.REQUIRED;
  if (Array.isArray(value) && value.length === 0) return MESSAGES.REQUIRED;
  return null;
};

/**
 * Validates an email address
 * @param {string} value - The email to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const email = (value) => {
  if (!value) return null; // Use required() for empty check
  return PATTERNS.EMAIL.test(value) ? null : MESSAGES.INVALID_EMAIL;
};

/**
 * Validates a password
 * @param {string} value - The password to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const password = (value) => {
  if (!value) return null; // Use required() for empty check
  return PATTERNS.PASSWORD.test(value) ? null : MESSAGES.INVALID_PASSWORD;
};

/**
 * Validates that two fields match (e.g., password confirmation)
 * @param {string} value1 - First value
 * @param {string} value2 - Second value to compare with
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message if invalid, null if valid
 */
const match = (value1, value2, fieldName = 'Fields') => {
  return value1 === value2 ? null : `${fieldName} do not match`;
};

/**
 * Validates minimum length of a string or array
 * @param {string|Array} value - The value to validate
 * @param {number} min - Minimum length
 * @returns {string|null} Error message if invalid, null if valid
 */
const minLength = (value, min) => {
  if (!value) return null; // Use required() for empty check
  const length = typeof value === 'string' ? value.trim().length : value.length;
  return length >= min ? null : MESSAGES.MIN_LENGTH(min);
};

/**
 * Validates maximum length of a string or array
 * @param {string|Array} value - The value to validate
 * @param {number} max - Maximum length
 * @returns {string|null} Error message if invalid, null if valid
 */
const maxLength = (value, max) => {
  if (!value) return null; // Use required() for empty check
  const length = typeof value === 'string' ? value.trim().length : value.length;
  return length <= max ? null : MESSAGES.MAX_LENGTH(max);
};

/**
 * Validates that a number is at least a minimum value
 * @param {number} value - The number to validate
 * @param {number} min - Minimum value
 * @returns {string|null} Error message if invalid, null if valid
 */
const minValue = (value, min) => {
  if (value === null || value === undefined || value === '') return null; // Use required() for empty check
  const num = Number(value);
  return !isNaN(num) && num >= min ? null : MESSAGES.MIN_VALUE(min);
};

/**
 * Validates that a number is at most a maximum value
 * @param {number} value - The number to validate
 * @param {number} max - Maximum value
 * @returns {string|null} Error message if invalid, null if valid
 */
const maxValue = (value, max) => {
  if (value === null || value === undefined || value === '') return null; // Use required() for empty check
  const num = Number(value);
  return !isNaN(num) && num <= max ? null : MESSAGES.MAX_VALUE(max);
};

/**
 * Validates that a number is between a min and max value
 * @param {number} value - The number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string|null} Error message if invalid, null if valid
 */
const between = (value, min, max) => {
  if (value === null || value === undefined || value === '') return null; // Use required() for empty check
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max ? null : MESSAGES.BETWEEN(min, max);
};

/**
 * Validates a phone number
 * @param {string} value - The phone number to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const phone = (value) => {
  if (!value) return null; // Use required() for empty check
  return PATTERNS.PHONE.test(value) ? null : MESSAGES.INVALID_PHONE;
};

/**
 * Validates a ZIP code
 * @param {string} value - The ZIP code to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const zipCode = (value) => {
  if (!value) return null; // Use required() for empty check
  return PATTERNS.ZIP_CODE.test(value) ? null : MESSAGES.INVALID_ZIP_CODE;
};

/**
 * Validates a URL
 * @param {string} value - The URL to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const url = (value) => {
  if (!value) return null; // Use required() for empty check
  return PATTERNS.URL.test(value) ? null : MESSAGES.INVALID_URL;
};

/**
 * Validates a credit card number
 * @param {string} value - The credit card number to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const creditCard = (value) => {
  if (!value) return null; // Use required() for empty check
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  return PATTERNS.CREDIT_CARD.test(digits) ? null : MESSAGES.INVALID_CREDIT_CARD;
};

/**
 * Validates a credit card expiry date (MM/YY format)
 * @param {string} value - The expiry date to validate (MM/YY)
 * @returns {string|null} Error message if invalid, null if valid
 */
const expiryDate = (value) => {
  if (!value) return null; // Use required() for empty check
  
  if (!PATTERNS.EXPIRY_DATE.test(value)) {
    return MESSAGES.INVALID_EXPIRY_DATE;
  }
  
  const [month, year] = value.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Last two digits of current year
  const currentMonth = now.getMonth() + 1; // 1-12
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

/**
 * Validates a CVC code
 * @param {string} value - The CVC to validate
 * @returns {string|null} Error message if invalid, null if valid
 */
const cvc = (value) => {
  if (!value) return null; // Use required() for empty check
  return PATTERNS.CVC.test(value) ? null : MESSAGES.INVALID_CVC;
};

/**
 * Validates that a value is one of the allowed choices
 * @param {*} value - The value to validate
 * @param {Array} choices - Array of allowed values
 * @returns {string|null} Error message if invalid, null if valid
 */
const oneOf = (value, choices) => {
  if (!value) return null; // Use required() for empty check
  return choices.includes(value) ? null : MESSAGES.INVALID_CHOICE;
};

/**
 * Composes multiple validation functions into a single function
 * @param {...Function} validators - Validation functions to compose
 * @returns {Function} A function that runs all validations and returns the first error
 */
const composeValidators = (...validators) => (value, allValues) => {
  return validators.reduce((error, validator) => {
    return error || (typeof validator === 'function' ? validator(value, allValues) : null);
  }, null);
};

/**
 * Creates a validation function for a form field
 * @param {Object} validations - Object mapping field names to validation functions
 * @returns {Function} A function that validates form values and returns errors object
 */
const createValidator = (validations) => (values) => {
  const errors = {};
  
  Object.keys(validations).forEach((field) => {
    const fieldValidators = Array.isArray(validations[field])
      ? validations[field]
      : [validations[field]];
    
    const validator = composeValidators(...fieldValidators);
    const error = validator(values[field], values);
    
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

// Export all validation functions and utilities
export {
  PATTERNS,
  MESSAGES,
  required,
  email,
  password,
  match,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  phone,
  zipCode,
  url,
  creditCard,
  expiryDate,
  cvc,
  oneOf,
  composeValidators,
  createValidator,
};

export default {
  PATTERNS,
  MESSAGES,
  required,
  email,
  password,
  match,
  minLength,
  maxLength,
  minValue,
  maxValue,
  between,
  phone,
  zipCode,
  url,
  creditCard,
  expiryDate,
  cvc,
  oneOf,
  composeValidators,
  createValidator,
};
