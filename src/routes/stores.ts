import { Context, Hono } from 'hono';
import { Org, Store } from '../models';
import protect from '../lib/middleware/auth';
import validateOrg from '../lib/middleware/validateOrg';
import { ErrorResponse } from 'hono-error-handler';

const stores = new Hono();

// @desc    Create store
// *route   POST /orgs/:orgSlug/stores
// !method  Private
stores.post('/', protect, validateOrg, async (c: Context) => {
  const orgId = c.get('org');

  const { name, slug, color } = await c.req.json();

  const store = await Store.create({
    name,
    slug: slug?.toLowerCase(),
    color,
    org: orgId,
  });

  return c.json({
    success: true,
    data: store,
  });
});

// @desc    Get all stores
// *route   GET /orgs/:orgSlug/stores
// ?method  Public
stores.get('/', async (c: Context) => {
  const orgSlug = c.req.param('orgSlug');

  const stores = await Org.findOne({ slug: orgSlug }).populate({
    path: 'stores',
    select: 'name slug color -org -_id',
  });

  // Checks if org exists not if there is any stores
  if (!stores) {
    throw new ErrorResponse('Organization not found', 404);
  }

  return c.json({
    success: true,
    data: stores,
  });
});

// @desc    Get single store
// *route   GET /orgs/:orgSlug/stores/:storeSlug
// ?method  Public
stores.get('/:storeSlug', validateOrg, async (c: Context) => {
  const orgId = c.get('org');
  const storeSlug = c.req.param('storeSlug');

  const store = await Store.findOne({ slug: storeSlug, org: orgId });

  if (!store) {
    throw new ErrorResponse('Store not found', 404);
  }

  return c.json({
    success: true,
    data: store,
  });
});

export default stores;
