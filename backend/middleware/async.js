/**
 * Async handler to wrap around async route handlers
 * This eliminates the need to write try/catch blocks in each async route handler
 * and passes any errors to the Express error handling middleware
 * 
 * @param {Function} fn - The async route handler function
 * @returns {Function} A middleware function that handles async/await errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Resolve the promise returned by the async function
  // and catch any errors to pass them to Express's error handler
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
