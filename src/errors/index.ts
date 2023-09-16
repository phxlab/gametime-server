import { Context } from 'hono';
import mongooseErrorHandler from './mongoose'; // Import your mongoose-specific error handler
import honoErrorHandler from './hono';
import { type } from 'os';
import { parseBody } from 'hono/dist/types/utils/body'; // Import your hono-specific error handler

export interface Error {
  message: string;
  stack?: any;
  statusCode?: number;
}

const errorHandlers = [mongooseErrorHandler, honoErrorHandler];

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

  return c.json(
    {
      success: false,
      message: err.message || 'Internal server error',
    },
    err.statusCode || 500,
  );
};

export default errorHandler;
