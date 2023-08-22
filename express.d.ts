import Store from './src/blueprints/stores/model';

export {};

declare global {
  namespace Express {
    export interface Request {
      store?: Store;
    }
  }
}
