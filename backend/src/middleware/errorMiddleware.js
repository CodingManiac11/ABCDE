const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  let error = { message: err.message };
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation failed';
    error.errors = {};
    for (const field in err.errors) {
      error.errors[field] = err.errors[field].message;
    }
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      field: field
    };
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token' };
  }
  
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired' };
  }

  res.status(statusCode).json({
    success: false,
    error: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(error.field && { field: error.field }),
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { errorHandler, notFound };
