import errorHandler from '../middleware/error';
import { Express } from 'express';

const setupCustomMiddleware = (app: Express) => {
  app.use(errorHandler);
};

export default setupCustomMiddleware;
