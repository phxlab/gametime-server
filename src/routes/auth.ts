import { Hono } from 'hono';
import { ErrorResponse } from 'hono-error-handler';
import { User } from '../models';
import protect from '../lib/middleware/auth';

const auth = new Hono();

// @desc    Login user
// *route   POST /auth/login
// ?method  Public
auth.post('/login', async (c) => {
  let { username, password } = await c.req.json();

  if (!username || !password) {
    throw new ErrorResponse('Enter a username and password', 400);
  }

  username = username?.toLowerCase();

  let user = await User.findOne({
    $or: [{ username }, { email: username }],
  }).select('+password');

  if (!user) {
    throw new ErrorResponse('Invalid username or password', 401);
  }

  const passwordIsMatched = await user.matchPassword(password);

  if (!passwordIsMatched) {
    throw new ErrorResponse('Invalid username or password', 401);
  }

  const token = await user.getToken();

  return c.json(
    {
      success: true,
      data: token,
    },
    200,
  );
});

// @desc    Get current user
// *route   GET /auth/me
// !method  Private
auth.get('/me', protect(), async (c) => {
  const userId = c.get('user');

  const user = await User.findById(userId);

  return c.json({
    success: true,
    data: user,
  });
});
export default auth;
