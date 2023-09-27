import { middleware } from 'hono/factory';
import * as jose from 'jose';
import { ErrorResponse } from 'hono-error-handler';
import { User } from '../../models';

const protect = (optional = false) =>
  middleware<{
    Variables: {
      user: string;
    };
  }>(async (c, next) => {
    let token = c.req.header('Authorization');

    if (!token && optional) {
      return await next();
    }

    if (!token || !token.startsWith('Bearer')) {
      throw new ErrorResponse('Not authorized', 401);
    }

    token = token.split(' ')[1];

    const encoder = new TextEncoder();
    const JWT_SECRET = encoder.encode(Bun.env.JWT_SECRET);

    let user;

    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);

      user = User.findById(payload.id).lean();

      c.set('user', payload.id as string);
    } catch (error) {
      throw new ErrorResponse('Not authorized', 401);
    }

    if (!user) {
      throw new ErrorResponse('Not authorized', 401);
    }

    await next();
  });

export default protect;
