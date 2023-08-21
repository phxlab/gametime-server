import express from 'express';
import { getStoreById, getStores } from './controller';
import storeOpenMiddleware from '../../middleware/storeOpen';

const stores = express.Router();

stores.route('/').get(getStores);

stores.route('/:storeId').get(storeOpenMiddleware, getStoreById);

export default stores;
