// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app.js';
import { importData } from '../../seeder.mjs';

const setUp = async () => {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  // eslint-disable-next-line no-underscore-dangle
  global.__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri;

  global.app = await app.listen(0);

  await importData();
};

export default setUp;
