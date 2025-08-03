/**
 * Form Validation Utility
 * 
 * This utility provides common validation functions for form fields.
 * It can be used with any form library or with plain React state.
 */

/**
 * Validation rules and their default error messages
 */
const VALIDATION_RULES = {
  required: {
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    },
    message: 'This field is required',
  },
  email: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(value).toLowerCase());
    },
    message: 'Please enter a valid email address',
  },
  minLength: {
    validate: (value, length) => {
      if (!value) return true; // Skip if empty (use with required)
      return String(value).length >= length;
    },
    message: (length) => `Must be at least ${length} characters`,
  },
  maxLength: {
    validate: (value, length) => {
      if (!value) return true; // Skip if empty (use with required)
      return String(value).length <= length;
    },
    message: (length) => `Must be no more than ${length} characters`,
  },
  password: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return re.test(value);
    },
    message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
  },
  match: {
    validate: (value, fieldValue, fieldName) => {
      if (!value) return true; // Skip if empty (use with required)
      return value === fieldValue;
    },
    message: (fieldName) => `Must match ${fieldName}`,
  },
  number: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      return !isNaN(Number(value));
    },
    message: 'Must be a valid number',
  },
  min: {
    validate: (value, min) => {
      if (!value) return true; // Skip if empty (use with required)
      return Number(value) >= min;
    },
    message: (min) => `Must be at least ${min}`,
  },
  max: {
    validate: (value, max) => {
      if (!value) return true; // Skip if empty (use with required)
      return Number(value) <= max;
    },
    message: (max) => `Must be no more than ${max}`,
  },
  url: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Please enter a valid URL',
  },
  phone: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/;
      return re.test(value);
    },
    message: 'Please enter a valid phone number',
  },
  creditCard: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      // Luhn algorithm for credit card validation
      const cleanValue = value.replace(/\D/g, '');
      let sum = 0;
      let shouldDouble = false;
      
      for (let i = cleanValue.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanValue.charAt(i), 10);
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
            digit = (digit % 10) + 1;
          }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return sum % 10 === 0;
    },
    message: 'Please enter a valid credit card number',
  },
  date: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      return !isNaN(Date.parse(value));
    },
    message: 'Please enter a valid date',
  },
  futureDate: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      const date = new Date(value);
      const today = new Date();
      return date > today;
    },
    message: 'Date must be in the future',
  },
  pastDate: {
    validate: (value) => {
      if (!value) return true; // Skip if empty (use with required)
      const date = new Date(value);
      const today = new Date();
      return date < today;
    },
    message: 'Date must be in the past',
  },
  oneOf: {
    validate: (value, options) => {
      if (!value) return true; // Skip if empty (use with required)
      return options.includes(value);
    },
    message: (options) => `Must be one of: ${options.join(', ')}`,
  },
  pattern: {
    validate: (value, pattern) => {
      if (!value) return true; // Skip if empty (use with required)
      const re = new RegExp(pattern);
      return re.test(value);
    },
    message: 'Does not match the required pattern',
  },
};

/**
 * Validates a single field value against validation rules
 * @param {*} value - The value to validate
 * @param {Array|Object} rules - Validation rules to apply
 * @param {Object} [formData] - The complete form data (for cross-field validation)
 * @returns {Array} Array of error messages (empty if valid)
 */
export const validateField = (value, rules, formData = {}) => {
  const errors = [];
  
  if (!rules) return errors;
  
  // Convert single rule to array for consistent processing
  const rulesArray = Array.isArray(rules) ? rules : [rules];
  
  for (const rule of rulesArray) {
    // Skip if no rule is provided
    if (!rule) continue;
    
    // Handle string shortcuts (e.g., 'required', 'email')
    if (typeof rule === 'string') {
      if (VALIDATION_RULES[rule]) {
        if (!VALIDATION_RULES[rule].validate(value)) {
          errors.push(
            typeof VALIDATION_RULES[rule].message === 'function'
              ? VALIDATION_RULES[rule].message()
              : VALIDATION_RULES[rule].message
          );
        }
      }
      continue;
    }
    
    // Handle rule objects
    for (const [ruleName, ruleValue] of Object.entries(rule)) {
      if (!VALIDATION_RULES[ruleName]) continue;
      
      const ruleConfig = VALIDATION_RULES[ruleName];
      const isValid = ruleConfig.validate(
        value,
        ruleValue,
        ruleValue === true ? null : ruleValue,
        formData
      );
      
      if (!isValid) {
        errors.push(
          typeof ruleConfig.message === 'function'
            ? ruleConfig.message(ruleValue === true ? null : ruleValue)
            : ruleConfig.message
        );
      }
    }
  }
  
  return errors;
};

/**
 * Validates an entire form
 * @param {Object} formData - The form data to validate
 * @param {Object} validationSchema - Validation schema defining rules for each field
 * @returns {Object} Object with field names as keys and arrays of error messages as values
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const fieldErrors = validateField(formData[fieldName], rules, formData);
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Creates a validation schema for a form
 * @param {Object} fields - Object with field names as keys and validation rules as values
 * @returns {Function} A validation function that takes form data and returns validation results
 */
export const createValidationSchema = (fields) => {
  return (formData) => validateForm(formData, fields);
};

// Example usage:
/*
const loginSchema = {
  email: [
    'required',
    'email',
    { maxLength: 100 }
  ],
  password: [
    'required',
    { minLength: 8 },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must include uppercase, lowercase, number, and special character'
    }
  ]
};

const validateLogin = createValidationSchema(loginSchema);
const { isValid, errors } = validateLogin(formData);
*/

export default {
  validateField,
  validateForm,
  createValidationSchema,
  rules: VALIDATION_RULES,
};
