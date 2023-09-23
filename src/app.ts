import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { errorHandler } from 'hono-error-handler';
import dbConnect from './lib/config/db';
import protect from './lib/middleware/auth';
import errorHandlers from './lib/errors';
import { auth, orgs, stores, users, waves } from './routes';

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
app.route('/orgs', orgs);
app.route('/orgs/:orgSlug/stores', stores);
app.route('/orgs/:orgSlug/stores/:storeSlug/waves', waves);
app.onError(errorHandler(errorHandlers));

// noinspection JSUnusedGlobalSymbols
export default app;
