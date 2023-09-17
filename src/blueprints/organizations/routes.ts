import { Hono } from 'hono';
import Org from './model';

const org = new Hono();

// @desc    Create org
// *route   POST /org
// !method  Private
org.post('/', async (c) => {
  const { name, slug } = await c.req.json();

  const data = await Org.create({
    name,
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
org.get('/', async (c) => {
  const org = await Org.find();

  return c.json({
    success: true,
    data: org,
  });
});
export default org;
