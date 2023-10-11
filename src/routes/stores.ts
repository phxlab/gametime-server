import { Hono } from 'hono';
import { Store } from '../models';
import protect from '../lib/middleware/auth';
import validateOrg from '../lib/middleware/validateOrg';
import { ErrorResponse } from 'hono-error-handler';
import validateStore from '../lib/middleware/validateStore';

const stores = new Hono();

// @desc    Create store
// *route   POST /orgs/:orgSlug/stores
// !method  Private
stores.post('/', protect(), validateOrg, async (c) => {
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
stores.get('/', validateOrg, async (c) => {
  const orgId = c.get('org');

  const stores = await Store.find({ org: orgId }).sort({ name: 'asc' });

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
stores.get('/:storeSlug', protect(true), validateStore, async (c) => {
  const orgId = c.get('org');
  const storeSlug = c.req.param('storeSlug');

  const store = await Store.findOne({
    slug: storeSlug,
    org: orgId,
    archived: false,
  }).populate({
    path: 'wave',
    match: { isActive: true },
  });

  return c.json({
    success: true,
    data: store,
  });
});

// @desc    Update store
// *route   PUT /orgs/:orgSlug/stores/:storeSlug
// !method  Private
stores.put('/:storeSlug', protect(), validateOrg, async (c) => {
  const storeSlug = c.req.param('storeSlug');
  const orgId = c.get('org');
  const { name, slug, color } = await c.req.json();
  const store = await Store.findOne({ slug: storeSlug, org: orgId });

  if (!store) {
    throw new ErrorResponse('Store not found', 404);
  }

  store.name = name || store.name;
  store.slug = slug || store.slug;
  store.color = color || store.color;

  await store.save();

  return c.json(
    {
      success: true,
      data: store,
    },
    200,
  );
});

// @desc    Archive store
// *route   DELETE /orgs/:orgSlug/stores/:storeSlug
// !method  Private
stores.delete('/:storeSlug', protect(), validateOrg, async (c) => {
  const storeSlug = c.req.param('storeSlug');
  const orgId = c.get('org');

  const store = await Store.findOne({ slug: storeSlug, org: orgId }).populate({
    path: 'wave',
    match: { isActive: true },
  });

  if (!store) {
    throw new ErrorResponse('Store not found', 404);
  }

  if (store.wave) {
    throw new ErrorResponse('Cannot archive active store', 409);
  }

  store.archived = true;

  await store.save();

  return c.json(
    {
      success: true,
      data: store,
    },
    200,
  );
});

export default stores;
