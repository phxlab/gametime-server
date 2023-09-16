import { expect, test, describe } from 'bun:test';
import r from 'supertest';

const request = r('http://server:3000');

let userId: string;

describe('Create user', () => {
  test('with no data sent - 400', async () => {
    const res = await request.post('/users').send('');

    expect(res.status).toBe(400);
    expect(res.body.sucess).toBeFalsy();
  });

  test('with some data sent - 400', async () => {
    const res = await request.post('/users').send({ name: 'Test User' });

    expect(res.status).toBe(400);
    expect(res.body.sucess).toBeFalsy();
  });

  test('with success - 201', async () => {
    const res = await request.post('/users').send({
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'password',
      username: 'test',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get all users', () => {
  test('with success - 200', async () => {
    const res = await request.get('/users');

    userId = res.body.data[0]._id;

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

  test('with success - 200', async () => {
    const res = await request
      .put(`/users/${userId}`)
      .send({ name: 'John Doe' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
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
