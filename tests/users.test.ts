import { expect, test, describe } from 'bun:test';
import r from 'supertest';
import User from '../src/models/users';
import { closeMongoose, startMongoose } from './config/db';

const request = r('http://localhost:3030');

let userId: string;

const testUser: { [key: string]: string } = {
  name: 'Test User',
  email: 'test@gmail.com',
  password: 'password',
  username: 'test',
};

describe('Create user', () => {
  test('with no auth - 401', async () => {
    const res = await request.post('/users').send('');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data sent - 400', async () => {
    const res = await request
      .post('/users')
      .send('')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  // @ts-ignore
  test.each(['name', 'email', 'username', 'password'])(
    'with partial data - 400',
    async (field: string) => {
      const { [field]: x, ...rest } = testUser;

      const res = await request
        .post('/users')
        .send(rest)
        .auth(global.__token, { type: 'bearer' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBeFalsy();
    },
  );

  test('with existing email - 409', async () => {
    const res = await request
      .post('/users')
      .send({
        name: 'Test User',
        email: 'jdoe@gmail.com',
        username: 'test',
        password: 'password',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing username - 409', async () => {
    const res = await request
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@gmail.com',
        username: 'john',
        password: 'password',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 201', async () => {
    const res = await request
      .post('/users')
      .send(testUser)
      .auth(global.__token, { type: 'bearer' });

    userId = res.body.data._id;

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.password).toBeUndefined();
  });
});

describe('Get all users', () => {
  test('with no auth - 401', async () => {
    const res = await request.get('/users');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .get('/users')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get user', () => {
  test('with no auth - 401', async () => {
    const res = await request.get(`/users/123`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with bad id - 404', async () => {
    const res = await request
      .get(`/users/123`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('that does not exist - 404', async () => {
    const res = await request
      .get(`/users/650577d73cb80d2b535a9810`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .get(`/users/${userId}`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Update user', () => {
  test('with no auth - 401', async () => {
    const res = await request.put(`/users/${userId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid params - 400', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid email - 400', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ email: 'test' })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing email - 409', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ email: 'jdoe@gmail.com' })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing username - 409', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ username: 'john' })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ name: 'Test Updated', password: 'password' })
      .auth(global.__token, { type: 'bearer' });

    await startMongoose();
    const user = await User.findById(userId).select('+password');
    await closeMongoose();

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.password).toBeUndefined();
    expect(user?.password !== 'password').toBeTruthy();
  });
});

describe('Delete user', () => {
  test('with bad id - 401', async () => {
    const res = await request.delete(`/users/123`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with bad id - 404', async () => {
    const res = await request
      .delete(`/users/123`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('that does not exist - 404', async () => {
    const res = await request
      .delete(`/users/650577d73cb80d2b535a9810`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .delete(`/users/${userId}`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
