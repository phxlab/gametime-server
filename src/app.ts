import express from 'express';

import setupMiddleware from './config/middleware';
import setupRoutes from './config/routes';
import setupCustomMiddleware from './config/customMiddleware';

const app = express();

setupMiddleware(app);
setupRoutes(app);
setupCustomMiddleware(app);

export default app;
