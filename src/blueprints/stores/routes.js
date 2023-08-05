import express from 'express';
import { getStoreById, getStores } from './controller.js';

const stores = express.Router();

stores.route('/')
  .get(getStores);

stores.route('/:id')
  .get(getStoreById);

export default stores;
