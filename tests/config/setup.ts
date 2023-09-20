import { beforeAll } from 'bun:test';
import { closeMongoose, startMongoose } from './db';
import { Org, Store, User } from '../../src/models';
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
