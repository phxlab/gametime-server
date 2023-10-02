import { Hono } from 'hono';
import { ErrorResponse } from 'hono-error-handler';
import protect from '../lib/middleware/auth';
import validateStore from '../lib/middleware/validateStore';
import { Item } from '../models';

const items = new Hono();

// @desc    Create Item
// *route   POST /orgs/:orgSlug/stores/:storeSlug/items
// !method  Private
items.post('/', protect(), validateStore, async (c) => {
  const {
    name,
    slug,
    price,
    images,
    sizes,
    sizeChart,
    customizations,
    categories,
  } = await c.req.json();
  const storeId = c.get('store');

  const item = await Item.create({
    name,
    slug: slug.toLowerCase(),
    price,
    images,
    sizes,
    sizeChart,
    customizations,
    categories,
    store: storeId,
  });

  return c.json(
    {
      success: true,
      data: item,
    },
    201,
  );
});

// @desc    Get all Items
// *route   GET /orgs/:orgSlug/stores/:storeSlug/items
// ?method  Public
items.get('/', protect(true), validateStore, async (c) => {
  const storeId = c.get('store');
  let archived = false;

  if (c.get('user') && c.req.query('archived') === 'true') {
    archived = true;
  }

  const items = await Item.find({ store: storeId, archived });

  return c.json(
    {
      success: true,
      data: items,
    },
    200,
  );
});

// @desc    Get item by slug
// *route   GET /orgs/:orgSlug/stores/:storeSlug/items/:itemSlug
// ?method  Public
items.get('/:itemSlug', protect(true), validateStore, async (c) => {
  const slug = c.req.param('itemSlug');
  let archived = false;

  if (c.get('user') && c.req.query('archived') === 'true') {
    archived = true;
  }

  const item = await Item.findOne({ slug, archived }).select('-store');

  if (!item) {
    throw new ErrorResponse('Item not found', 404);
  }

  return c.json(
    {
      success: true,
      data: item,
    },
    200,
  );
});

// @desc    Update item by slug
// *route   PUT /orgs/:orgSlug/stores/:storeSlug/items/:itemSlug
// ?method  Public
items.put('/:itemSlug', protect(true), validateStore, async (c) => {
  const itemSlug = c.req.param('itemSlug');
  const {
    name,
    slug,
    price,
    images,
    sizes,
    sizeChart,
    customizations,
    categories,
    archived,
  } = await c.req.json();

  const item = await Item.findOneAndUpdate(
    { slug: itemSlug },
    {
      name,
      slug: slug?.toLowerCase(),
      price,
      images,
      sizes,
      sizeChart,
      customizations,
      categories,
      archived,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!item) {
    throw new ErrorResponse('Item not found', 404);
  }

  return c.json(
    {
      success: true,
      data: item,
    },
    200,
  );
});

export default items;
