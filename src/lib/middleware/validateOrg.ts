import { createMiddleware } from 'hono/factory';
import { ErrorResponse } from 'hono-error-handler';
import { Org } from '../../models';

const validateOrg = createMiddleware<{
  Variables: {
    org: string;
  };
}>(async (c, next) => {
  const orgSlug = c.req.param('orgSlug');
  const org = await Org.findOne({ slug: orgSlug });

  if (!org) {
    throw new ErrorResponse('Organization does not exist', 404);
  }

  c.set('org', org.id);

  await next();
});

export default validateOrg;
