import errorHandler from '../middleware/error.js';

const setupCustomMiddleware = (app) => {
  app.use(errorHandler);
};

export default setupCustomMiddleware;
