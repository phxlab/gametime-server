import stores from '../blueprints/stores/routes.js';

const setupRoutes = (app) => {
  app.use('/stores', stores);
};

export default setupRoutes;
