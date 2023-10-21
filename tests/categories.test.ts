import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030');

let category: { id: string; name: string; store: string } | null;

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

    category = res.body.data;

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get all categories', () => {
  test('with no auth - 200', async () => {
    const res = await request.get('/orgs/ths/stores/football/categories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('success - 200', async () => {
    const res = await request.get('/orgs/ths/stores/football/categories');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get category', () => {
  test('with invalid id - 404', async () => {
    const res = await request.get('/orgs/ths/stores/football/categories/1');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with no auth - 200', async () => {
    const res = await request.get(
      `/orgs/ths/stores/football/categories/${category?.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('success - 200', async () => {
    const res = await request
      .get(`/orgs/ths/stores/football/categories/${category?.id}`)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Update category', () => {
  test('with no auth - 401', async () => {
    const res = await request.put(
      `/orgs/ths/stores/football/categories/${category?.id}`,
    );

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid id - 404', async () => {
    const res = await request
      .put(`/orgs/ths/stores/football/categories/1`)
      .auth(global.__token, { type: 'bearer' })
      .send({});

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 200', async () => {
    const res = await request
      .put(`/orgs/ths/stores/football/categories/${category?.id}`)
      .auth(global.__token, { type: 'bearer' })
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('success - 200', async () => {
    const res = await request
      .put(`/orgs/ths/stores/football/categories/${category?.id}`)
      .auth(global.__token, { type: 'bearer' })
      .send({ name: 'Updated Category' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Delete category', () => {
  test.todo('with no auth - 401');
  test.todo('with invalid id - 404');
  test.todo('with no data - 400');
  test.todo('success - 200');
});
