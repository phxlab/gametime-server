import { Hono } from 'hono';
import { logger } from 'hono/logger';
import dbConnect from './config/db';
import users from './blueprints/users/routes';
import errorHandler from './errors';

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
app.route('/users', users);
app.onError(errorHandler);

export default app;
