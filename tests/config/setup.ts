import { beforeAll } from 'bun:test';
import User from '../../src/blueprints/users/model';
import { closeMongoose, startMongoose } from './db';

beforeAll(async () => {
  await startMongoose();

  await User.deleteMany();

  const user = await User.create({
    name: 'John Doe',
    email: 'jdoe@gmail.com',
    username: 'john',
    password: 'password',
  });

  global.__token = await user.getToken();

  await closeMongoose();
});
