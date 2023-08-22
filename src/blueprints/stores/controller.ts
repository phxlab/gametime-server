import asyncHandler from 'express-async-handler';
import Store from './model';

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
// @route  GET /stores/:storeId
// @access Public
export const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeId });

  res.status(200).json({
    success: true,
    data: store,
  });
});
