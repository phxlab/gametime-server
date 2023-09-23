import { Context, Hono } from 'hono';
import protect from '../lib/middleware/auth';
import { Wave } from '../models';
import validateStore from '../lib/middleware/validateStore';

const waves = new Hono();

// @desc    Create wave
// *route   POST /orgs/:orgSlug/stores/:storeSlug/waves
// !method  Private
waves.post('/', protect, async (c) => {
  const { name, open, close } = await c.req.json();

  const wave = await Wave.create({
    name,
    open,
    close,
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
waves.get('/', validateStore, async (c: Context) => {
  const storeId = c.get('store');

  const wave = await Wave.find({ store: storeId });

  return c.json(
    {
      success: true,
      data: wave,
    },
    200,
  );
});

// @desc    Update waves
// *route   PUT /orgs/:orgSlug/stores/:storeSlug/waves
// !method  Private

// @desc    Delete wave
// *route   DELETE /orgs/:orgSlug/stores/:storeSlug/waves/:waveId
// !method  Private

export default waves;
