import asyncHandler from 'express-async-handler';
import Store from './model';
import ErrorResponse from '../../utils/errorResponse';

// @desc   Get all stores
// @route  GET /stores
// @access Private
export const getStores = asyncHandler(async (_req, res) => {
  const stores = await Store.find();

  res.status(200).json({
    success: true,
    data: stores,
  });
});

// @desc   Get store by id
// @route  GET /stores/:id
// @access Public
export const getStoreById = asyncHandler(async (req, res, next) => {
  const store = await Store.findById(req.params.id);

  if (!store) {
    // store = await Store.findById(req.params.id);

    if (!store) {
      return next(new ErrorResponse('No store found', 404));
    }
  }

  res.status(200).json({
    success: true,
    data: store,
  });
});
