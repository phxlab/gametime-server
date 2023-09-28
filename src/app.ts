import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { errorHandler } from 'hono-error-handler';
import protect from './lib/middleware/auth';
import errorHandlers from './lib/errors';
import { auth, orgs, stores, users, waves } from './routes';

const app = new Hono();

app.use('*', logger());
app.get('/', (c) =>
  c.json({
    name: 'GameTime Server',
    version: '0.0.1',
  }),
);

app.route('/auth', auth);
app.use('/users/*', protect());
app.route('/users', users);
app.route('/orgs', orgs);
app.route('/orgs/:orgSlug/stores', stores);
app.route('/orgs/:orgSlug/stores/:storeSlug/waves', waves);
app.onError(
  errorHandler(errorHandlers, (err, c) => {
    console.log(err.stack);
    return c.json(
      {
        success: false,
        message: err.message || 'Internal server error',
      },
      err.statusCode || 500,
    );
  }),
);

// noinspection JSUnusedGlobalSymbols
export default app;
