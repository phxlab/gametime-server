import asyncHandler from 'express-async-handler';
import Store from '../stores/model';
import ErrorResponse from '../../utils/errorResponse';
import Wave from './model';

// ?desc    Get all waves in store
// @route   /waves/:storeId
// !access  Private
export const getWaves = asyncHandler(async (req, res, next) => {
  let store = await Store.findOne({
    slug: req.params.storeId,
  });

  if (!store) {
    store = await Store.findById(req.params.storeId);

    if (!store) {
      return next(new ErrorResponse('Store not found', 404));
    }
  }

  const waves = Wave.find({ storeId: store._id, isClosed: false });

  res.status(200).json({
    success: true,
    message: waves,
  });
});
