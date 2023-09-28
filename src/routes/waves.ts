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

  const openWave = await Wave.findOne({ store: storeId, isActive: true });

  if (openWave) {
    throw new ErrorResponse('There can only be one active wave at a time', 409);
  }

  const wave = await Wave.create({
    name,
    open: new Date(open),
    close: new Date(close),
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
waves.get('/', protect(), validateStore, async (c) => {
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

// @desc    Update Active
// *route   PUT /orgs/:orgSlug/stores/:storeSlug/waves
// !method  Private
waves.put('/', protect(), validateStore, async (c) => {
  const storeId = c.get('store');
  const { name, open, close } = await c.req.json();
  let openDate, closeDate;

  const wave = await Wave.findOne({ store: storeId, isActive: true });

  if (!wave) {
    throw new ErrorResponse('No active wave found', 404);
  }

  if (open) {
    openDate = new Date(open);
  }

  if (close) {
    closeDate = new Date(close);
  }

  wave.name = name || wave.name;
  wave.open = openDate || wave.open;
  wave.close = closeDate || wave.close;

  await wave.save();

  return c.json(
    {
      success: true,
      data: wave,
    },
    200,
  );
});

// Todo: Finalize store - check date, orders, clear carts

export default waves;
