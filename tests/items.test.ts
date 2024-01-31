import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030/orgs');

describe('Create item', () => {
  test('with no auth - 401', async () => {
    const res = await request.post('/ths/stores/football/items');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 400', async () => {
    const res = await request
      .post('/ths/stores/football/items')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toContain('Name');
    expect(res.body.message).toContain('Slug');
    expect(res.body.message).toContain('Price');
    expect(res.body.message).toContain('Image');
  });

  test('with success - 201', async () => {
    const res = await request
      .post('/ths/stores/football/items')
      .send({
        name: 'Test Item',
        slug: 'test-item',
        price: 100,
        images: [{ url: 'https://via.placeholder.com/150' }],
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });

  test('with existing slug - 409', async () => {
    const res = await request
      .post('/ths/stores/football/items')
      .send({
        name: 'Test Item',
        slug: 'test-item',
        price: 100,
        images: [{ url: 'https://via.placeholder.com/150' }],
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toContain('Slug');
  });
});

describe('Get all items as user', () => {
  test('with store not open - 202', async () => {
    const res = await request.get('/ths/stores/opening/items');

    expect(res.status).toBe(202);
    expect(res.body.success).toBeFalsy();
  });

  test('with store closed - 403', async () => {
    const res = await request.get('/ths/stores/closed/items');

    expect(res.status).toBe(403);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.get('/ths/stores/football/items');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get all items as admin', () => {
  test('with store not open - 200', async () => {
    const res = await request
      .get('/ths/stores/opening/items')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with store closed - 200', async () => {
    const res = await request
      .get('/ths/stores/closed/items')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with success - 200', async () => {
    const res = await request
      .get('/ths/stores/football/items')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get item as user', () => {
  test('with store not open - 202', async () => {
    const res = await request.get('/ths/stores/opening/items/test');

    expect(res.status).toBe(202);
    expect(res.body.success).toBeFalsy();
  });

  test('with store closed - 403', async () => {
    const res = await request.get('/ths/stores/closed/items/test');

    expect(res.status).toBe(403);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid item - 404', async () => {
    const res = await request.get('/ths/stores/football/items/invalid-item');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.get('/ths/stores/football/items/test-item');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get item as admin', () => {
  test('with store not open - 200', async () => {
    const res = await request
      .get('/ths/stores/opening/items/test')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with store closed - 200', async () => {
    const res = await request
      .get('/ths/stores/closed/items/test')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with invalid item - 404', async () => {
    const res = await request
      .get('/ths/stores/football/items/invalid-item')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.get('/ths/stores/football/items/test-item');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Update item', () => {
  test('with no auth - 401', async () => {
    const res = await request.put('/ths/stores/football/items/test-item');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid item - 404', async () => {
    const res = await request
      .put('/ths/stores/football/items/invalid-item')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 200', async () => {
    const res = await request
      .put('/ths/stores/football/items/test-item')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('success - 200', async () => {
    const res = await request
      .put('/ths/stores/football/items/test-item')
      .send({
        name: 'Updated Test Item',
        slug: 'test-item',
        price: 100,
        images: [{ url: 'https://via.placeholder.com/150' }],
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Archive item', () => {
  test.todo('with no auth - 401');
  test.todo('success - 200');
});

describe('Get all archived items', () => {
  test.todo('with no auth - 200');
  test.todo('with success - 200');
});

describe('Get archived item', () => {
  test.todo('with no auth - 404');
  test.todo('with success - 200');
});
