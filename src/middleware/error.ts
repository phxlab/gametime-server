import {Request, Response, NextFunction} from "express";
import ErrorResponse from '../utils/errorResponse';

interface ErrorHandler extends Error {
  code?: number | undefined;
  keyValue?: { [fieldName: string]: string };
  statusCode?: number;
  errors?: { [key: string]: { message: string } } | undefined;
}

const errorHandler = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  let error = { ...err };

  if (error.stack) {
    console.error(`${err.stack}`.red);
  }

  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000 && err.keyValue !== undefined) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} is already registered`;
    error = new ErrorResponse(message, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors !== undefined) {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};

export default errorHandler;
