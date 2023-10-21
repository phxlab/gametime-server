import { Hono } from 'hono';
import protect from '../lib/middleware/auth';
import validateStore from '../lib/middleware/validateStore';
import { Category } from '../models';
import { ErrorResponse } from 'hono-error-handler';

const categories = new Hono();

// @desc    Create category
// *route   POST /orgs/:orgSlug/stores/:storeSlug/categories
// !method  Private
categories.post('/', protect(), validateStore, async (c) => {
  const { name } = await c.req.json();
  const storeId = c.get('store');

  const category = await Category.create({
    name: name,
    store: storeId,
  });

  return c.json(
    {
      success: true,
      data: category,
    },
    201,
  );
});

// @desc    Get all categories
// *route   GET /orgs/:orgSlug/stores/:storeSlug/categories
// ?method  Public
categories.get('/', protect(true), validateStore, async (c) => {
  const storeId = c.get('store');

  const categories = await Category.find({ store: storeId }).select('-store');

  return c.json(
    {
      success: true,
      data: categories,
    },
    200,
  );
});

// @desc    Get category by id
// *route   GET /orgs/:orgSlug/stores/:storeSlug/categories/:id
// ?method  Public
categories.get('/:id', protect(true), validateStore, async (c) => {
  const categoryId = c.req.param('id');

  const category = await Category.findById(categoryId)
    .select('-store')
    .populate('items');

  if (!category) {
    throw new ErrorResponse('Category not found', 404);
  }

  return c.json(
    {
      success: true,
      data: category,
    },
    200,
  );
});

// @desc    Update category by id
// *route   PUT /orgs/:orgSlug/stores/:storeSlug/categories/:id
// !method  Private
categories.put('/:id', protect(), validateStore, async (c) => {
  const categoryId = c.req.param('id');
  const { name } = await c.req.json();

  const category = await Category.findById(categoryId).select('-store');

  if (!category) {
    throw new ErrorResponse('Category not found', 404);
  }

  category.name = name || category.name;

  await category.save();

  return c.json(
    {
      success: true,
      data: category,
    },
    200,
  );
});

// @desc    Delete category by id
// *route   DELETE /orgs/:orgSlug/stores/:storeSlug/categories/:id
// !method  Private
categories.delete('/:id', protect(), validateStore, async (c) => {
  const categoryId = c.req.param('id');

  // todo: Check if items in category
  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ErrorResponse('Category not found', 404);
  }

  return c.json(
    {
      success: true,
      data: [],
    },
    200,
  );
});

export default categories;
