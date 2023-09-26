import { Hono } from 'hono';
import { ErrorResponse } from 'hono-error-handler';
import { Org } from '../models';
import protect from '../lib/middleware/auth';

const org = new Hono();

// @desc    Create org
// *route   POST /orgs
// !method  Private
org.post('/', protect, async (c) => {
  const { name, slug } = await c.req.json();
  const data = await Org.create({
    name,
    slug: slug?.toLowerCase(),
  });

  return c.json(
    {
      success: true,
      data,
    },
    201,
  );
});

// @desc    Get all orgs
// *route   GET /orgs
// !method  Private
org.get('/', protect, async (c) => {
  const org = await Org.find();

  return c.json({
    success: true,
    data: org,
  });
});

// @desc    Get org by slug
// *route   GET /orgs/:slug
// ?method  Public
org.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const org = await Org.findOne({ slug });

  if (!org) {
    throw new ErrorResponse('Org not found', 404);
  }

  return c.json({
    success: true,
    data: org,
  });
});

// @desc    Update org by slug
// *route   PUT /orgs/:slug
// !method  Private
org.put('/:slug', protect, async (c) => {
  const slug = c.req.param('slug');
  const data = await c.req.json();

  const org = await Org.findOne({ slug });

  if (!org) {
    throw new ErrorResponse('Org not found', 404);
  }

  org.name = data.name || org.name;
  await org.save();

  return c.json({
    success: true,
    data: org,
  });
});

// @desc    Delete org by slug
// *route   DELETE /orgs/:slug
// !method  Private
org.delete('/:slug', protect, async (c) => {
  const slug = c.req.param('slug');

  const org = await Org.findOneAndDelete({ slug });

  if (!org) {
    throw new ErrorResponse('Org not found', 404);
  }

  return c.json({
    success: true,
    data: org,
  });
});

export default org;
