import { Hono } from 'hono';
import { logger } from 'hono/logger';
import dbConnect from './config/db';

(async () => {
  await dbConnect();
})();

const app = new Hono();

app.use('*', logger());
app.get('/', (c) =>
  c.json({
    name: 'GameTime Server',
    version: '0.0.1',
  }),
);

export default app;
