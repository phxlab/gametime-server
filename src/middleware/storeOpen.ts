import { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import Store from '../blueprints/stores/model';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse';

const isStoreOpen = (waves: { open: string; close: string }[]) => {
  const currentTimePST = DateTime.local().setZone('America/Los_Angeles');
  const currentTimestamp = currentTimePST.toMillis();

  for (const wave of waves) {
    const [openYear, openMonth, openDay] = wave.open.split('-').map(Number);
    const [closeYear, closeMonth, closeDay] = wave.close.split('-').map(Number);
    const openTimeLosAngeles = DateTime.local(openYear, openMonth, openDay, {
      zone: 'America/Los_Angeles',
    });
    const closeTimeLosAngeles = DateTime.local(
      closeYear,
      closeMonth,
      closeDay,
      { zone: 'America/Los_Angeles' },
    );

    const openTimestamp = openTimeLosAngeles.toMillis();
    const closeTimestamp = closeTimeLosAngeles.toMillis();

    if (
      currentTimestamp >= openTimestamp &&
      currentTimestamp <= closeTimestamp
    ) {
      return true; // Store is open
    }
  }

  return false; // Store is closed
};

const storeOpenMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;

    let store = await Store.findOne({ slug: storeId });

    if (!store) {
      store = await Store.findById(storeId);

      if (!store) {
        return next(new ErrorResponse('No store found', 404));
      }
    }

    const waves = await store.getOpenWaves();

    // Check if the store is currently open
    const isCurrentlyOpen = isStoreOpen(waves);

    if (!isCurrentlyOpen) {
      // Handle case where store is closed
      return next(new ErrorResponse('Store not open', 403));
    } else {
      // Store is open, continue to the next middleware
      next();
    }
  },
);

export default storeOpenMiddleware;
