import { Context } from 'hono';
import { UserDocument } from './model';

export const findOr404 = (user: UserDocument | null, c: Context) => {
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
};
