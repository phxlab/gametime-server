import express from 'express';
import setupMiddleware from './config/middleware.js';
import setupRoutes from './config/routes.js';
import setupCustomMiddleware from './config/customMiddleware.js';

const app = express();

setupMiddleware(app);
setupRoutes(app);
setupCustomMiddleware(app);

export default app;
