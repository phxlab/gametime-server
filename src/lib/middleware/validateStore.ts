import { middleware } from 'hono/factory';
import { ErrorResponse } from 'hono-error-handler';
import { Store } from '../../models';
import { OrgDocument } from '../../models/orgs';

const validateStore = middleware(async (c, next) => {
  const orgSlug = c.req.param('orgSlug');
  const storeSlug = c.req.param('storeSlug');

  const store = await Store.findOne({
    slug: storeSlug,
  }).populate<{ org: OrgDocument }>('org');

  if (!store || orgSlug !== store?.org.slug) {
    throw new ErrorResponse('Store does not exist', 404);
  }

  c.set('store', store.id);
  c.set('org', store.org.id);

  await next();
});

export default validateStore;
