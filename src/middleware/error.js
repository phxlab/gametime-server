import ErrorResponse from '../utils/errorResponse.js';

// eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  if (error.stack) {
    console.error(err.stack.red);
  }

  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} is already registered`;
    error = new ErrorResponse(message, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

export default errorHandler;
