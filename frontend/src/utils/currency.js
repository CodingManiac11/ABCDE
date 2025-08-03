/**
 * Currency Utility
 * 
 * This utility provides consistent currency formatting, parsing, and calculations
 * throughout the application. It supports multiple currencies and locales.
 */

// Common currency configurations
export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    symbolOnLeft: true,
    spaceBetweenAmountAndSymbol: false,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    symbolOnLeft: true,
    spaceBetweenAmountAndSymbol: true,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    symbolOnLeft: true,
    spaceBetweenAmountAndSymbol: false,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    decimalDigits: 0,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    symbolOnLeft: true,
    spaceBetweenAmountAndSymbol: false,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimalDigits: 2,
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    symbolOnLeft: true,
    spaceBetweenAmountAndSymbol: false,
  },
};

// Default currency (USD)
const DEFAULT_CURRENCY = 'USD';

/**
 * Get currency configuration
 * @param {string} [currencyCode] - The currency code (defaults to DEFAULT_CURRENCY)
 * @returns {Object} The currency configuration
 */
export const getCurrency = (currencyCode = DEFAULT_CURRENCY) => {
  return CURRENCIES[currencyCode.toUpperCase()] || CURRENCIES[DEFAULT_CURRENCY];
};

/**
 * Format a number as currency
 * @param {number|string} amount - The amount to format
 * @param {Object} [options] - Formatting options
 * @param {string} [options.currency] - The currency code (defaults to DEFAULT_CURRENCY)
 * @param {boolean} [options.includeSymbol=true] - Whether to include the currency symbol
 * @param {number} [options.decimalDigits] - Override the default decimal digits
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = DEFAULT_CURRENCY,
    includeSymbol = true,
    decimalDigits,
  } = options;
  
  const currencyConfig = getCurrency(currency);
  const digits = decimalDigits !== undefined ? decimalDigits : currencyConfig.decimalDigits;
  
  // Convert to number and handle invalid values
  let numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (isNaN(numericAmount)) numericAmount = 0;
  
  // Round to the correct number of decimal places
  const roundedAmount = Math.round(numericAmount * Math.pow(10, digits)) / Math.pow(10, digits);
  
  // Format the number with thousands and decimal separators
  const parts = roundedAmount.toString().split('.');
  let integerPart = parts[0];
  let decimalPart = digits > 0 ? (parts[1] || '').padEnd(digits, '0') : '';
  
  // Add thousands separators
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, currencyConfig.thousandsSeparator);
  
  // Build the formatted amount
  let formattedAmount = integerPart;
  if (digits > 0) {
    formattedAmount += currencyConfig.decimalSeparator + decimalPart;
  }
  
  // Add currency symbol if needed
  if (includeSymbol) {
    const space = currencyConfig.spaceBetweenAmountAndSymbol ? ' ' : '';
    formattedAmount = currencyConfig.symbolOnLeft
      ? `${currencyConfig.symbol}${space}${formattedAmount}`
      : `${formattedAmount}${space}${currencyConfig.symbol}`;
  }
  
  return formattedAmount;
};

/**
 * Parse a currency string into a number
 * @param {string} currencyString - The currency string to parse
 * @param {Object} [options] - Parsing options
 * @param {string} [options.currency] - The currency code (defaults to DEFAULT_CURRENCY)
 * @returns {number} The parsed number
 */
export const parseCurrency = (currencyString, options = {}) => {
  const { currency = DEFAULT_CURRENCY } = options;
  const currencyConfig = getCurrency(currency);
  
  if (!currencyString || typeof currencyString !== 'string') {
    return 0;
  }
  
  // Remove all non-numeric characters except decimal separator and minus sign
  const decimalSeparator = currencyConfig.decimalSeparator === '.' ? '\\.' : currencyConfig.decimalSeparator;
  const regex = new RegExp(`[^0-9${decimalSeparator}-]`, 'g');
  const numericString = currencyString.replace(regex, '');
  
  // Replace decimal separator with dot for parsing
  const normalizedString = numericString.replace(
    new RegExp(`\\${currencyConfig.decimalSeparator}`, 'g'),
    '.'
  );
  
  const parsed = parseFloat(normalizedString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Add two currency amounts
 * @param {number|string} a - First amount
 * @param {number|string} b - Second amount
 * @param {Object} [options] - Options
 * @param {number} [options.decimalDigits] - Number of decimal places to round to
 * @returns {number} The sum of a and b
 */
export const add = (a, b, options = {}) => {
  const { decimalDigits } = options;
  const numA = typeof a === 'string' ? parseFloat(a) : Number(a);
  const numB = typeof b === 'string' ? parseFloat(b) : Number(b);
  
  if (isNaN(numA) || isNaN(numB)) return 0;
  
  const result = numA + numB;
  return decimalDigits !== undefined 
    ? Math.round(result * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits)
    : result;
};

/**
 * Subtract one currency amount from another
 * @param {number|string} a - The amount to subtract from
 * @param {number|string} b - The amount to subtract
 * @param {Object} [options] - Options
 * @param {number} [options.decimalDigits] - Number of decimal places to round to
 * @returns {number} The result of a - b
 */
export const subtract = (a, b, options = {}) => {
  const { decimalDigits } = options;
  const numA = typeof a === 'string' ? parseFloat(a) : Number(a);
  const numB = typeof b === 'string' ? parseFloat(b) : Number(b);
  
  if (isNaN(numA) || isNaN(numB)) return 0;
  
  const result = numA - numB;
  return decimalDigits !== undefined 
    ? Math.round(result * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits)
    : result;
};

/**
 * Multiply a currency amount by a factor
 * @param {number|string} amount - The amount to multiply
 * @param {number|string} factor - The multiplication factor
 * @param {Object} [options] - Options
 * @param {number} [options.decimalDigits] - Number of decimal places to round to
 * @returns {number} The result of amount * factor
 */
export const multiply = (amount, factor, options = {}) => {
  const { decimalDigits } = options;
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  const numFactor = typeof factor === 'string' ? parseFloat(factor) : Number(factor);
  
  if (isNaN(numAmount) || isNaN(numFactor)) return 0;
  
  const result = numAmount * numFactor;
  return decimalDigits !== undefined 
    ? Math.round(result * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits)
    : result;
};

/**
 * Divide a currency amount by a divisor
 * @param {number|string} amount - The amount to divide
 * @param {number|string} divisor - The divisor
 * @param {Object} [options] - Options
 * @param {number} [options.decimalDigits] - Number of decimal places to round to
 * @returns {number} The result of amount / divisor
 */
export const divide = (amount, divisor, options = {}) => {
  const { decimalDigits } = options;
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  let numDivisor = typeof divisor === 'string' ? parseFloat(divisor) : Number(divisor);
  
  if (isNaN(numAmount) || isNaN(numDivisor) || numDivisor === 0) return 0;
  
  const result = numAmount / numDivisor;
  return decimalDigits !== undefined 
    ? Math.round(result * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits)
    : result;
};

/**
 * Calculate a percentage of an amount
 * @param {number|string} amount - The base amount
 * @param {number|string} percentage - The percentage (0-100)
 * @param {Object} [options] - Options
 * @param {number} [options.decimalDigits] - Number of decimal places to round to
 * @returns {number} The calculated percentage of the amount
 */
export const calculatePercentage = (amount, percentage, options = {}) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : Number(percentage);
  
  if (isNaN(numAmount) || isNaN(numPercentage)) return 0;
  
  return multiply(numAmount, numPercentage / 100, options);
};

/**
 * Calculate the percentage difference between two amounts
 * @param {number|string} original - The original amount
 * @param {number|string} newAmount - The new amount
 * @param {Object} [options] - Options
 * @param {number} [options.decimalDigits] - Number of decimal places to round to
 * @returns {number} The percentage difference (-100 to +infinity)
 */
export const calculatePercentageDifference = (original, newAmount, options = {}) => {
  const numOriginal = typeof original === 'string' ? parseFloat(original) : Number(original);
  const numNew = typeof newAmount === 'string' ? parseFloat(newAmount) : Number(newAmount);
  
  if (isNaN(numOriginal) || isNaN(numNew) || numOriginal === 0) return 0;
  
  const difference = numNew - numOriginal;
  const percentage = (difference / Math.abs(numOriginal)) * 100;
  
  const { decimalDigits } = options;
  return decimalDigits !== undefined
    ? Math.round(percentage * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits)
    : percentage;
};

/**
 * Format a number as a percentage
 * @param {number|string} value - The value to format (0-1 or 0-100)
 * @param {Object} [options] - Formatting options
 * @param {number} [options.decimalDigits=2] - Number of decimal places to show
 * @param {boolean} [options.isDecimal=true] - Whether the input is a decimal (0-1) or percentage (0-100)
 * @returns {string} The formatted percentage string
 */
export const formatPercentage = (value, options = {}) => {
  const { decimalDigits = 2, isDecimal = true } = options;
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(numValue)) return '0%';
  
  const percentage = isDecimal ? numValue * 100 : numValue;
  const rounded = decimalDigits >= 0
    ? Math.round(percentage * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits)
    : percentage;
    
  return `${rounded}%`;
};

// Default export with common functions
export default {
  // Constants
  CURRENCIES,
  DEFAULT_CURRENCY,
  
  // Currency configuration
  getCurrency,
  
  // Formatting
  formatCurrency,
  formatPercentage,
  
  // Parsing
  parseCurrency,
  
  // Calculations
  add,
  subtract,
  multiply,
  divide,
  calculatePercentage,
  calculatePercentageDifference,
};
