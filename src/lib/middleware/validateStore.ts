import { createMiddleware } from 'hono/factory';
import { ErrorResponse } from 'hono-error-handler';
import { Org, Store } from '../../models';

const validateStore = createMiddleware<{
  Variables: {
    store: string;
    org: string;
    user: string;
  };
}>(async (c, next) => {
  const orgSlug = c.req.param('orgSlug');
  const storeSlug = c.req.param('storeSlug');
  const user = c.get('user');

  const org = await Org.findOne({ slug: orgSlug });

  if (!org) {
    throw new ErrorResponse('Organization not found', 404);
  }

  const store = await Store.findOne({
    slug: storeSlug,
    org: org.id,
  }).populate({
    path: 'wave',
    match: { isActive: true },
  });

  if (!store) {
    throw new ErrorResponse('Store not found', 404);
  }

  if (!store.wave && !user) {
    throw new ErrorResponse('Store is closed', 403);
  }

  if (!user && store.wave) {
    if (new Date(store.wave.open) > new Date()) {
      return c.json(
        {
          success: false,
          open: store.wave.open,
        },
        202,
      );
    }

    if (new Date(store.wave.close) < new Date()) {
      throw new ErrorResponse('Store is closed', 403);
    }
  }

  c.set('store', store.id);
  c.set('org', org.id);

  await next();
});

export default validateStore;
