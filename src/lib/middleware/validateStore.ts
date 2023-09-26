import { middleware } from 'hono/factory';
import { ErrorResponse } from 'hono-error-handler';
import { Org, Store } from '../../models';

const validateStore = middleware<{
  Variables: {
    store: string;
    org: string;
  };
}>(async (c, next) => {
  const orgSlug = c.req.param('orgSlug');
  const storeSlug = c.req.param('storeSlug');

  const org = await Org.findOne({ slug: orgSlug });

  if (!org) {
    throw new ErrorResponse('Organization not found', 404);
  }

  const store = await Store.findOne({
    slug: storeSlug,
    org: org.id,
  });

  if (!store) {
    throw new ErrorResponse('Store not found', 404);
  }

  c.set('store', store.id);
  c.set('org', org.id);

  await next();
});

export default validateStore;
