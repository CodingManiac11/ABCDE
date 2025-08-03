/**
 * Date/Time Utility
 * 
 * This utility provides consistent date/time handling, formatting, and manipulation
 * throughout the application using date-fns library.
 */

import {
  format,
  formatDistanceToNow,
  formatDistance,
  parseISO,
  isValid,
  isBefore,
  isAfter,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameDay,
  isSameMonth,
  isSameYear,
  getDay,
  getDate,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';

// Common date formats used throughout the app
export const DATE_FORMATS = {
  // Date formats
  DATE_SHORT: 'MM/dd/yyyy',
  DATE_MEDIUM: 'MMM d, yyyy',
  DATE_LONG: 'MMMM d, yyyy',
  DATE_FULL: 'EEEE, MMMM d, yyyy',
  
  // Time formats
  TIME_SHORT: 'h:mm a',
  TIME_MEDIUM: 'h:mm:ss a',
  TIME_24: 'HH:mm',
  TIME_24_FULL: 'HH:mm:ss',
  
  // Combined date and time formats
  DATETIME_SHORT: 'MM/dd/yyyy h:mm a',
  DATETIME_MEDIUM: 'MMM d, yyyy h:mm a',
  DATETIME_LONG: 'MMMM d, yyyy h:mm a',
  DATETIME_FULL: 'EEEE, MMMM d, yyyy h:mm a',
  
  // File system safe formats
  FILENAME: 'yyyy-MM-dd_HH-mm-ss',
  
  // API formats (ISO 8601)
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

/**
 * Parse a date string or timestamp into a Date object
 * @param {string|number|Date} date - The date to parse
 * @returns {Date} The parsed date
 */
export const parseDate = (date) => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  if (typeof date === 'number') return new Date(date);
  if (typeof date === 'string') {
    // Try parsing as ISO string
    const parsed = new Date(date);
    if (isValid(parsed)) return parsed;
    
    // Try parsing as timestamp
    if (/^\d+$/.test(date)) {
      return new Date(parseInt(date, 10));
    }
  }
  
  return new Date();
};

/**
 * Format a date as a string
 * @param {string|number|Date} date - The date to format
 * @param {string} formatStr - The format string (see DATE_FORMATS)
 * @returns {string} The formatted date string
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DATE_MEDIUM) => {
  const parsedDate = parseDate(date);
  return format(parsedDate, formatStr);
};

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 * @param {string|number|Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} The relative time string
 */
export const formatRelativeTime = (date, options = {}) => {
  const parsedDate = parseDate(date);
  const { addSuffix = true, includeSeconds = false } = options;
  
  return formatDistanceToNow(parsedDate, {
    addSuffix,
    includeSeconds,
  });
};

/**
 * Format the distance between two dates
 * @param {string|number|Date} fromDate - The start date
 * @param {string|number|Date} toDate - The end date
 * @param {Object} options - Formatting options
 * @returns {string} The formatted distance string
 */
export const formatDistanceBetween = (fromDate, toDate, options = {}) => {
  const parsedFrom = parseDate(fromDate);
  const parsedTo = parseDate(toDate);
  
  return formatDistance(parsedFrom, parsedTo, {
    addSuffix: true,
    ...options,
  });
};

/**
 * Check if a date is today
 * @param {string|number|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isDateToday = (date) => {
  return isToday(parseDate(date));
};

/**
 * Check if a date is yesterday
 * @param {string|number|Date} date - The date to check
 * @returns {boolean} True if the date is yesterday
 */
export const isDateYesterday = (date) => {
  return isYesterday(parseDate(date));
};

/**
 * Check if a date is in the current week
 * @param {string|number|Date} date - The date to check
 * @returns {boolean} True if the date is in the current week
 */
export const isDateThisWeek = (date) => {
  return isThisWeek(parseDate(date));
};

/**
 * Check if a date is in the current month
 * @param {string|number|Date} date - The date to check
 * @returns {boolean} True if the date is in the current month
 */
export const isDateThisMonth = (date) => {
  return isThisMonth(parseDate(date));
};

/**
 * Check if a date is in the current year
 * @param {string|number|Date} date - The date to check
 * @returns {boolean} True if the date is in the current year
 */
export const isDateThisYear = (date) => {
  return isThisYear(parseDate(date));
};

/**
 * Add days to a date
 * @param {string|number|Date} date - The start date
 * @param {number} amount - The number of days to add
 * @returns {Date} The new date
 */
export const addDaysToDate = (date, amount) => {
  return addDays(parseDate(date), amount);
};

/**
 * Add months to a date
 * @param {string|number|Date} date - The start date
 * @param {number} amount - The number of months to add
 * @returns {Date} The new date
 */
export const addMonthsToDate = (date, amount) => {
  return addMonths(parseDate(date), amount);
};

/**
 * Add years to a date
 * @param {string|number|Date} date - The start date
 * @param {number} amount - The number of years to add
 * @returns {Date} The new date
 */
export const addYearsToDate = (date, amount) => {
  return addYears(parseDate(date), amount);
};

/**
 * Subtract days from a date
 * @param {string|number|Date} date - The start date
 * @param {number} amount - The number of days to subtract
 * @returns {Date} The new date
 */
export const subtractDaysFromDate = (date, amount) => {
  return subDays(parseDate(date), amount);
};

/**
 * Subtract months from a date
 * @param {string|number|Date} date - The start date
 * @param {number} amount - The number of months to subtract
 * @returns {Date} The new date
 */
export const subtractMonthsFromDate = (date, amount) => {
  return subMonths(parseDate(date), amount);
};

/**
 * Subtract years from a date
 * @param {string|number|Date} date - The start date
 * @param {number} amount - The number of years to subtract
 * @returns {Date} The new date
 */
export const subtractYearsFromDate = (date, amount) => {
  return subYears(parseDate(date), amount);
};

/**
 * Get the difference in days between two dates
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {number} The difference in days
 */
export const getDaysDifference = (dateLeft, dateRight) => {
  return differenceInDays(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Get the difference in hours between two dates
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {number} The difference in hours
 */
export const getHoursDifference = (dateLeft, dateRight) => {
  return differenceInHours(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Get the difference in minutes between two dates
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {number} The difference in minutes
 */
export const getMinutesDifference = (dateLeft, dateRight) => {
  return differenceInMinutes(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Get the difference in seconds between two dates
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {number} The difference in seconds
 */
export const getSecondsDifference = (dateLeft, dateRight) => {
  return differenceInSeconds(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Get the start of the day for a date
 * @param {string|number|Date} date - The date
 * @returns {Date} The start of the day
 */
export const getStartOfDay = (date) => {
  return startOfDay(parseDate(date));
};

/**
 * Get the end of the day for a date
 * @param {string|number|Date} date - The date
 * @returns {Date} The end of the day
 */
export const getEndOfDay = (date) => {
  return endOfDay(parseDate(date));
};

/**
 * Get the start of the week for a date
 * @param {string|number|Date} date - The date
 * @param {Object} options - Options for week start day (0 = Sunday, 1 = Monday, etc.)
 * @returns {Date} The start of the week
 */
export const getStartOfWeek = (date, options = {}) => {
  return startOfWeek(parseDate(date), { weekStartsOn: 0, ...options });
};

/**
 * Get the end of the week for a date
 * @param {string|number|Date} date - The date
 * @param {Object} options - Options for week start day (0 = Sunday, 1 = Monday, etc.)
 * @returns {Date} The end of the week
 */
export const getEndOfWeek = (date, options = {}) => {
  return endOfWeek(parseDate(date), { weekStartsOn: 0, ...options });
};

/**
 * Get the start of the month for a date
 * @param {string|number|Date} date - The date
 * @returns {Date} The start of the month
 */
export const getStartOfMonth = (date) => {
  return startOfMonth(parseDate(date));
};

/**
 * Get the end of the month for a date
 * @param {string|number|Date} date - The date
 * @returns {Date} The end of the month
 */
export const getEndOfMonth = (date) => {
  return endOfMonth(parseDate(date));
};

/**
 * Get the start of the year for a date
 * @param {string|number|Date} date - The date
 * @returns {Date} The start of the year
 */
export const getStartOfYear = (date) => {
  return startOfYear(parseDate(date));
};

/**
 * Get the end of the year for a date
 * @param {string|number|Date} date - The date
 * @returns {Date} The end of the year
 */
export const getEndOfYear = (date) => {
  return endOfYear(parseDate(date));
};

/**
 * Check if two dates are the same day
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {boolean} True if the dates are the same day
 */
export const areSameDay = (dateLeft, dateRight) => {
  return isSameDay(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Check if two dates are in the same month
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {boolean} True if the dates are in the same month
 */
export const areSameMonth = (dateLeft, dateRight) => {
  return isSameMonth(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Check if two dates are in the same year
 * @param {string|number|Date} dateLeft - The first date
 * @param {string|number|Date} dateRight - The second date
 * @returns {boolean} True if the dates are in the same year
 */
export const areSameYear = (dateLeft, dateRight) => {
  return isSameYear(parseDate(dateLeft), parseDate(dateRight));
};

/**
 * Get the day of the week (0 = Sunday, 1 = Monday, etc.)
 * @param {string|number|Date} date - The date
 * @returns {number} The day of the week (0-6)
 */
export const getDayOfWeek = (date) => {
  return getDay(parseDate(date));
};

/**
 * Get the day of the month (1-31)
 * @param {string|number|Date} date - The date
 * @returns {number} The day of the month (1-31)
 */
export const getDayOfMonth = (date) => {
  return getDate(parseDate(date));
};

/**
 * Get the month (0-11)
 * @param {string|number|Date} date - The date
 * @returns {number} The month (0-11)
 */
export const getMonth = (date) => {
  return getMonth(parseDate(date));
};

/**
 * Get the year
 * @param {string|number|Date} date - The date
 * @returns {number} The year
 */
export const getYear = (date) => {
  return getYear(parseDate(date));
};

/**
 * Get the hours (0-23)
 * @param {string|number|Date} date - The date
 * @returns {number} The hours (0-23)
 */
export const getHours = (date) => {
  return getHours(parseDate(date));
};

/**
 * Get the minutes (0-59)
 * @param {string|number|Date} date - The date
 * @returns {number} The minutes (0-59)
 */
export const getMinutes = (date) => {
  return getMinutes(parseDate(date));
};

/**
 * Get the seconds (0-59)
 * @param {string|number|Date} date - The date
 * @returns {number} The seconds (0-59)
 */
export const getSeconds = (date) => {
  return getSeconds(parseDate(date));
};

/**
 * Set the hours of a date
 * @param {string|number|Date} date - The date
 * @param {number} hours - The hours to set (0-23)
 * @returns {Date} The new date
 */
export const setHours = (date, hours) => {
  return setHours(parseDate(date), hours);
};

/**
 * Set the minutes of a date
 * @param {string|number|Date} date - The date
 * @param {number} minutes - The minutes to set (0-59)
 * @returns {Date} The new date
 */
export const setMinutes = (date, minutes) => {
  return setMinutes(parseDate(date), minutes);
};

/**
 * Set the seconds of a date
 * @param {string|number|Date} date - The date
 * @param {number} seconds - The seconds to set (0-59)
 * @returns {Date} The new date
 */
export const setSeconds = (date, seconds) => {
  return setSeconds(parseDate(date), seconds);
};

// Default export with common functions
export default {
  // Constants
  DATE_FORMATS,
  
  // Parsing
  parseDate,
  
  // Formatting
  formatDate,
  formatRelativeTime,
  formatDistanceBetween,
  
  // Date checks
  isDateToday,
  isDateYesterday,
  isDateThisWeek,
  isDateThisMonth,
  isDateThisYear,
  
  // Date manipulation
  addDaysToDate,
  addMonthsToDate,
  addYearsToDate,
  subtractDaysFromDate,
  subtractMonthsFromDate,
  subtractYearsFromDate,
  
  // Date differences
  getDaysDifference,
  getHoursDifference,
  getMinutesDifference,
  getSecondsDifference,
  
  // Date ranges
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  getStartOfYear,
  getEndOfYear,
  
  // Date comparisons
  areSameDay,
  areSameMonth,
  areSameYear,
  
  // Date parts
  getDayOfWeek,
  getDayOfMonth,
  getMonth,
  getYear,
  getHours,
  getMinutes,
  getSeconds,
  
  // Date setters
  setHours,
  setMinutes,
  setSeconds,
};
