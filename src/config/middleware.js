import express from 'express';
import helmet from 'helmet';

const setupMiddleware = (app) => {
  app.use(express.json());
  app.use(helmet());
};

export default setupMiddleware;
