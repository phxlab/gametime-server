import stores from '../blueprints/stores/routes';
import { Express } from "express";

const setupRoutes = (app: Express) => {
  app.use('/stores', stores);
};

export default setupRoutes;
