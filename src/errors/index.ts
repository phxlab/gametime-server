import { ErrorHandler } from 'hono';
import mongooseErrorHandler from './mongoose';
import handleHonoErrors from './hono';

const errorHandlers = [mongooseErrorHandler, handleHonoErrors];

const errorHandler =
  (stack = true): ErrorHandler =>
  async (error: any, c) => {
    if (stack && error.stack) {
      console.error(error.stack);
    }

    if (!error.message || !error.statusCode) {
      for (const handleError of errorHandlers) {
        error = handleError(error);

        if (error.statusCode) {
          break;
        }
      }
    }

    return c.json(
      {
        success: false,
        message: error.message || 'Internal server error',
      },
      error?.statusCode || 500,
    );
  };

export default errorHandler;
