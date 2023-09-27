import { Hono } from 'hono';
import protect from '../lib/middleware/auth';
import { Wave } from '../models';
import validateStore from '../lib/middleware/validateStore';
import { ErrorResponse } from 'hono-error-handler';

const waves = new Hono();

// @desc    Create wave
// *route   POST /orgs/:orgSlug/stores/:storeSlug/waves
// !method  Private
waves.post('/', protect(), validateStore, async (c) => {
  const storeId = c.get('store');
  const { name, open, close } = await c.req.json();

  const openWave = await Wave.findOne({ isActive: true });

  if (openWave) {
    throw new ErrorResponse('There can only be one active wave at a time', 409);
  }

  const wave = await Wave.create({
    name,
    open,
    close,
    store: storeId,
  });

  return c.json(
    {
      success: true,
      data: wave,
    },
    201,
  );
});

// @desc    Get waves
// *route   GET /orgs/:orgSlug/stores/:storeSlug/waves
// !method  Private
waves.get('/', validateStore, protect(), async (c) => {
  const storeId = c.get('store');

  const waves = await Wave.find({ store: storeId });

  return c.json(
    {
      success: true,
      data: waves,
    },
    200,
  );
});

export default waves;
