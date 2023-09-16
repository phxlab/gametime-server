import { Hono } from 'hono';
import User from './model';

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

  if (!user) {
    return c.json(
      {
        success: false,
        message: 'User not found',
      },
      404,
    );
  }

  return c.json(
    {
      success: true,
      data: user,
    },
    200,
  );
});

// @desc    Update user by id
// *route   PUT /users/:id
// !method  Private
auth.put('/:id', async (c) => {
  const data = await c.req.json();

  const user = await User.findById(c.req.param('id'));

  if (!user) {
    return c.json({
      success: false,
      message: 'User not found',
    });
  }

  user.name = data.name || user.email;
  user.email = data.email || user.email;
  user.username = data.username || user.username;

  if (data.password) {
    user.password = data.password;
  }

  await user.save();

  return c.json({
    success: true,
    data: user,
  });
});

// @desc    Delete user by id
// *route   DELETE /users/:id
// !method  Private
auth.delete('/:id', async (c) => {
  const user = await User.findByIdAndDelete(c.req.param('id'));

  if (!user) {
    return c.json(
      {
        success: false,
        message: 'User not found',
      },
      404,
    );
  }

  return c.json(
    {
      success: true,
      data: user,
    },
    200,
  );
});

export default auth;
