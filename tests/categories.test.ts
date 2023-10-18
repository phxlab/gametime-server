import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030');

describe('Create category', () => {
  test('with no auth - 401', async () => {
    const res = await request.post('/orgs/ths/stores/football/categories');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 400', async () => {
    const res = await request
      .post('/orgs/ths/stores/football/categories')
      .auth(global.__token, { type: 'bearer' })
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('success - 201', async () => {
    const res = await request
      .post('/orgs/ths/stores/football/categories')
      .auth(global.__token, { type: 'bearer' })
      .send({
        name: 'Required Items',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get all categories', () => {
  test.todo('with no auth - 200');
  test.todo('success - 200');
});

describe('Get category', () => {
  test.todo('with invalid id - 404');
  test.todo('with no auth - 200');
  test.todo('success - 200');
});

describe('Update category', () => {
  test.todo('with no auth - 401');
  test.todo('with invalid id - 404');
  test.todo('with no data - 400');
  test.todo('success - 200');
});

describe('Delete category', () => {
  test.todo('with no auth - 401');
  test.todo('with invalid id - 404');
  test.todo('with no data - 400');
  test.todo('success - 200');
});
