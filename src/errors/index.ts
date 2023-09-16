import { Context } from 'hono';
import mongooseErrorHandler from './mongoose';

export interface Error {
  message: string;
  stack?: any;
  statusCode?: number;
}

const errorHandlers = [mongooseErrorHandler];

const errorHandler = async (error: any, c: Context) => {
  let err: Error | null = {
    message: error.message,
    stack: error.stack,
  };

  if (error.stack) {
    console.error(error.stack);
  }

  for (const handleError of errorHandlers) {
    err = handleError(error, err);

    if (err.statusCode) {
      break;
    }
  }

  if (err.message && !err.statusCode) {
    err.statusCode = 400;
  }

  return c.json(
    {
      success: false,
      message: err.message || 'Internal server error',
    },
    err.statusCode || 500,
  );
};

export default errorHandler;
