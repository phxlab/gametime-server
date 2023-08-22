import { Express } from 'express';
import stores from '../blueprints/stores/routes';
import categories from '../blueprints/categories/routes';

const setupRoutes = (app: Express) => {
  app.use('/stores', stores);
  app.use('/categories', categories);
};

export default setupRoutes;
