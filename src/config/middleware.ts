import express, { Express } from 'express';
import helmet from 'helmet';

const setupMiddleware = (app: Express) => {
  app.use(express.json());
  app.use(helmet());
};

export default setupMiddleware;
