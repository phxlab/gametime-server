import { beforeAll } from 'bun:test';
import User from '../../src/blueprints/users/model';
import { closeMongoose, startMongoose } from './db';
import Org from '../../src/blueprints/organizations/model';
import Store from '../../src/blueprints/stores/model';
import { orgs, stores } from './data';

beforeAll(async () => {
  await startMongoose();

  await User.deleteMany();
  await Org.deleteMany();
  await Store.deleteMany();

  const user = await User.create({
    name: 'John Doe',
    email: 'jdoe@gmail.com',
    username: 'john',
    password: 'password',
  });

  await Org.create(orgs);

  await Store.create(stores);

  global.__token = await user.getToken();

  await closeMongoose();
});
