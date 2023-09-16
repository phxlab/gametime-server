import { Hono } from 'hono';

const auth = new Hono();

// @desc    Login user
// *route   POST /auth/login
// !method  Public
auth.post('');
export default auth;
