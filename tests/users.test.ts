import { expect, test, describe, beforeAll } from 'bun:test';
import r from 'supertest';
import mongoose from 'mongoose';
import User from '../src/blueprints/users/model';

const request = r('http://server:3000');

let userId: string;

const testUser: { [key: string]: string } = {
  name: 'Test User',
  email: 'test@gmail.com',
  password: 'password',
  username: 'test',
};

beforeAll(async () => {
  const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'gametime',
  };

  await mongoose.connect('mongodb://root:password@mongodb/', options);
  await User.deleteMany();

  await User.create({
    name: 'John Doe',
    email: 'jdoe@gmail.com',
    username: 'john',
    password: 'password',
  });
});

describe('Create user', () => {
  test('with no data sent - 400', async () => {
    const res = await request.post('/users').send('');

    expect(res.status).toBe(400);
    expect(res.body.sucess).toBeFalsy();
  });

  // @ts-ignore
  test.each(['name', 'email', 'username', 'password'])(
    'with partial data - 400',
    async (field: string) => {
      const { [field]: x, ...rest } = testUser;

      const res = await request.post('/users').send(rest);

      expect(res.status).toBe(400);
      expect(res.body.sucess).toBeFalsy();
    },
  );

  test('with existing email - 409', async () => {
    const res = await request.post('/users').send({
      name: 'Test User',
      email: 'jdoe@gmail.com',
      username: 'test',
      password: 'password',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing username - 409', async () => {
    const res = await request.post('/users').send({
      name: 'Test User',
      email: 'test@gmail.com',
      username: 'john',
      password: 'password',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 201', async () => {
    const res = await request.post('/users').send(testUser);

    userId = res.body.data._id;

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.password).toBeUndefined();
  });
});

describe('Get all users', () => {
  test('with success - 200', async () => {
    const res = await request.get('/users');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get users', () => {
  test('with bad id - 404', async () => {
    const res = await request.get(`/users/123`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('that does not exist - 404', async () => {
    const res = await request.get(`/users/650577d73cb80d2b535a9810`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Update user', () => {
  test('with invalid params - 400', async () => {
    const res = await request.put(`/users/${userId}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid email - 400', async () => {
    const res = await request.put(`/users/${userId}`).send({ email: 'test' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing email - 409', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ email: 'jdoe@gmail.com' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing username - 409', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ username: 'john' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ name: 'Test Updated', password: 'password' });

    const user = await User.findById(userId).select('+password');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.password).toBeUndefined();
    expect(user?.password !== 'password').toBeTruthy();
  });
});

describe('Delete user', () => {
  test('with bad id - 404', async () => {
    const res = await request.delete(`/users/123`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('that does not exist - 404', async () => {
    const res = await request.delete(`/users/650577d73cb80d2b535a9810`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.delete(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
