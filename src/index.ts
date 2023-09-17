import { Hono } from 'hono';
import { logger } from 'hono/logger';
import dbConnect from './config/db';
import errorHandler from './errors';
import users from './blueprints/users/routes';
import org from './blueprints/organizations/routes';
import auth from './blueprints/auth/routes';
import protect from './middleware/auth';

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

app.route('/auth', auth);
app.use('/users/*', protect);
app.route('/users', users);
app.route('/org', org);
app.onError(errorHandler);

export default app;
