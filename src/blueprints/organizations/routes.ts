import { Hono } from 'hono';
import Org from './model';
import protect from '../../middleware/auth';
import ErrorResponse from '../../errors/errorResponse';

const org = new Hono();

// @desc    Create org
// *route   POST /org
// !method  Private
org.post('/', protect, async (c) => {
  const { name, slug } = await c.req.json();

  const data = await Org.create({
    name: name.toLowerCase(),
    slug,
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
// *route   GET /org
// !method  Private
org.get('/', protect, async (c) => {
  const org = await Org.find();

  return c.json({
    success: true,
    data: org,
  });
});

// @desc    Get org by slug
// *route   GET /org/:id
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
// *route   PUT /org/:id
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

export default org;
