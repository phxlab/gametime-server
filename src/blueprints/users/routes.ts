import { Hono } from 'hono';
import User from './model';
import { findOr404 } from './users';

const auth = new Hono();

// @desc    Create user
// *route   POST /users
// !method  Private
auth.post('/', async (c) => {
  const { name, email, password, username } = await c.req.json();

  const data = await User.create({ name, email, password, username });

  const { password: pass, ...responseData } = data.toObject();

  return c.json(
    {
      success: true,
      data: responseData,
    },
    201,
  );
});

// @desc    Get all users
// *route   GET /users
// !method  Private
auth.get('/', async (c) => {
  const users = await User.find();

  return c.json(
    {
      success: true,
      data: users,
    },
    200,
  );
});

// @desc    Get user by id
// *route   GET /users/:id
// !method  Private
auth.get('/:id', async (c) => {
  const user = await User.findById(c.req.param('id'));

  return findOr404(user, c);
});

// @desc    Update user by id
// *route   PUT /users/:id
// !method  Private
auth.put('/:id', async (c) => {
  const { name, email, password, username } = await c.req.json();
  const user = await User.findByIdAndUpdate(
    c.req.param('id'),
    { name, email, password, username },
    {
      new: true,
      runValidators: true,
    },
  );

  return findOr404(user, c);
});

// @desc    Delete user by id
// *route   DELETE /users/:id
// !method  Private
auth.delete('/:id', async (c) => {
  const user = await User.findByIdAndDelete(c.req.param('id'));

  return findOr404(user, c);
});
export default auth;
