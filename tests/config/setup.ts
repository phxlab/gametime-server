import { beforeAll } from 'bun:test';
import User from '../../src/blueprints/users/model';
import { closeMongoose, startMongoose } from './db';
import Org from '../../src/blueprints/organizations/model';

beforeAll(async () => {
  await startMongoose();

  await User.deleteMany();
  await Org.deleteMany();

  const user = await User.create({
    name: 'John Doe',
    email: 'jdoe@gmail.com',
    username: 'john',
    password: 'password',
  });

  await Org.create({
    name: 'Test Org',
    slug: 'test',
  });

  global.__token = await user.getToken();

  await closeMongoose();
});
