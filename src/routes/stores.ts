import { Context, Hono } from 'hono';
import { ErrorResponse } from 'hono-error-handler';
import { Org, Store } from '../models';
import protect from '../lib/middleware/auth';

const stores = new Hono();

// @desc    Create store
// *route   POST /org/:orgSlug/stores
// !method  Private
stores.post('/', protect, async (c: Context) => {
  const orgSlug = c.req.param('orgSlug');
  const org = await Org.findOne({ slug: orgSlug });

  if (!org) {
    throw new ErrorResponse('Organization does not exist', 404);
  }

  const { name, slug, color } = await c.req.json();

  const store = await Store.create({
    name,
    slug: slug?.toLowerCase(),
    color,
    org,
  });

  return c.json({
    success: true,
    data: store,
  });
});

// @desc    Get all stores
// *route   GET /org/:orgSlug/stores
// ?method  Public
stores.get('/', async (c: Context) => {
  const orgSlug = c.req.param('orgSlug');

  const stores = await Org.findOne({ slug: orgSlug }).populate({
    path: 'stores',
    select: 'name slug color -org -_id',
  });

  return c.json({
    success: true,
    data: stores,
  });
});

// @desc    Get single store
// *route   GET /org/:orgSlug/stores/:storeSlug
// ?method  Public
stores.get('/:storeSlug', async (c: Context) => {
  const orgSlug = c.req.param('orgSlug');
  const storeSlug = c.req.param('storeSlug');

  const store = await Org.findOne({ slug: orgSlug }).populate({
    path: 'store',
    select: 'name slug color -org -_id',
  });

  return c.json({
    success: true,
    data: store,
  });
});

export default stores;
