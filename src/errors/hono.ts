import { Error } from './index';

const handleHonoErrors = (error: any, err: Error) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((val: any) => val.message);
    err.message = messages.join(', ');
    err.statusCode = 400;
  }

  return err;
};

export default handleHonoErrors;
