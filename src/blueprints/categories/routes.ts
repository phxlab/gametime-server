import express from 'express';
import { getCategories } from './controller';
import storeOpenMiddleware from '../../middleware/storeOpen';

const categories = express.Router();

categories.route('/:storeId').get(storeOpenMiddleware, getCategories);

export default categories;
