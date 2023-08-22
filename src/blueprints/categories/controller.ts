import asyncHandler from 'express-async-handler';
import Category from './model';

// ?desc     Get all categories in a store
// @route   /categories/:storeId
// *access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ store: req.store.id }, '-store');

  res.status(200).json({
    success: true,
    data: categories,
  });
});
