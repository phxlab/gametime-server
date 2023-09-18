import handleHonoErrors from './hono';
import handleMongooseErrors from './mongoose';

const errorHandlers = [handleHonoErrors, handleMongooseErrors];

export default errorHandlers;
