import { Error } from 'hono-error-handler';

const handleMongooseErrors = (error: Error) => {
  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
    return error;
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    console.log(error.name);
    const field = Object.keys(error.keyValue)[0];
    error.message = `${field} is already registered`;
    error.statusCode = 409;
    return error;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    let message = '';
    error.statusCode = 400;
    Object.values(error.errors).map((val: any) => {
      message += `${val.message},`;
      if (val.kind === 'Conflict') {
        error.statusCode = 409;
      }
    });
    error.message = message;
    return error;
  }

  // General Mongoose error
  if (error.name === 'MongooseError') {
    error.message = `Server Timeout`;
    error.statusCode = 500;
    return error;
  }

  return error;
};

export default handleMongooseErrors;
