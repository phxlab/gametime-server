import { Hono } from 'hono';
import { ErrorResponse } from 'hono-error-handler';
import { User } from '../models';

const users = new Hono();

// @desc    Create user
// *route   POST /users
// !method  Private
users.post('/', async (c) => {
  const { name, email, password, username } = await c.req.json();

  const data = await User.create({
    name,
    email: email?.toLowerCase(),
    password,
    username: username?.toLowerCase(),
  });

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
users.get('/', async (c) => {
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
users.get('/:id', async (c) => {
  const user = await User.findById(c.req.param('id'));

  if (!user) {
    throw new ErrorResponse('User not found', 404);
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
users.put('/:id', async (c) => {
  const data = await c.req.json();

  const user = await User.findById(c.req.param('id'));

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  user.name = data.name || user.name;
  user.email = data.email?.toLowerCase() || user.email;
  user.username = data.username?.toLowerCase() || user.username;

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
users.delete('/:id', async (c) => {
  const user = await User.findByIdAndDelete(c.req.param('id'));

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  return c.json(
    {
      success: true,
      data: user,
    },
    200,
  );
});

export default users;
