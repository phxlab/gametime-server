import { ErrorHandler } from 'hono';

export interface CustomErrorHandler {
  statusCode?: number;
  stack?: string;
  message: string;
  [key: string]: any;
}

const errorHandler =
  (errorHandlers: Function[], printStack = true): ErrorHandler =>
  async (err, c) => {
    let error: CustomErrorHandler = err;

    console.log(typeof error.stack);

    if (printStack && error.stack) {
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
