import { beforeAll } from 'bun:test';
import { closeMongoose, startMongoose } from './db';
import { Org, Store, User, Wave } from '../../src/models';
import { orgs, stores, users, waves } from './data';

beforeAll(async () => {
  await startMongoose();

  await User.deleteMany();
  await Org.deleteMany();
  await Store.deleteMany();
  await Wave.deleteMany();

  const user = await User.create(users);

  await Org.create(orgs);

  await Store.create(stores);

  await Wave.create(waves);

  global.__token = await user.getToken();

  await closeMongoose();
});
