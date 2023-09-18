import { CustomErrorHandler } from 'hono-error-handler';

const handleMongooseErrors = (error: CustomErrorHandler) => {
  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
    return error;
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    error.message = `${field} is already registered`;
    error.statusCode = 409;
    return error;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    let message = '';
    Object.values(error.errors).map((val: any) => {
      message += `${val.message},`;
    });
    error.message = message;
    error.statusCode = 400;
    return error;
  }

  return error;
};

export default handleMongooseErrors;
