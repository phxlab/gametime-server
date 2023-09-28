import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030/orgs');

describe('Create store', () => {
  const storeData = {
    name: 'Football',
    slug: 'football',
    color: 'blue',
  };

  test('with no auth - 401', async () => {
    const res = await request.post('/test/stores').send({});

    expect(res.status).toBe(401);
    expect(res.body.sucess).toBeFalsy();
  });

  test('with org that does not exist - 404', async () => {
    const res = await request
      .post('/invalid/stores')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 400', async () => {
    const res = await request
      .post('/ths/stores')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toContain('Name');
    expect(res.body.message).toContain('Slug');
    expect(res.body.message).toContain('Color');
  });

  test('with existing slug - 409', async () => {
    const res = await request
      .post('/ths/stores')
      .send(storeData)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing slug from different store - 200', async () => {
    const res = await request
      .post('/ehs/stores')
      .send(storeData)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with success - 200', async () => {
    const res = await request
      .post('/ehs/stores')
      .send({
        name: 'baseball',
        slug: 'baseball',
        color: 'red',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get all stores', () => {
  test('with invalid org - 404', async () => {
    const res = await request.get('/invalid/stores');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.get('/ths/stores');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.stores).toBeArray();
  });
});

describe('Get single store', () => {
  test('with invalid org - 404', async () => {
    const res = await request.get('/invalid/stores/football');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid store - 404', async () => {
    const res = await request.get('/ehs/stores/hockey');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with store from different org - 404', async () => {
    const res = await request.get('/ths/stores/baseball');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with no wave - 403', async () => {
    const res = await request.get('/ths/stores/wave');

    expect(res.status).toBe(403);
    expect(res.body.success).toBeFalsy();
  });

  test('with not open wave - 202', async () => {
    const res = await request.get('/ths/stores/opening');

    expect(res.status).toBe(202);
    expect(res.body.success).toBeFalsy();
    expect(res.body.open).toBeDefined();
  });

  test('with closed wave - 403', async () => {
    const res = await request.get('/ths/stores/closed');

    expect(res.status).toBe(403);
    expect(res.body.success).toBeFalsy();
  });

  test('with no wave with auth - 200', async () => {
    const res = await request
      .get('/ths/stores/wave')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with not open wave with auth - 200', async () => {
    const res = await request
      .get('/ths/stores/opening')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with closed wave with auth - 200', async () => {
    const res = await request
      .get('/ths/stores/closed')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });

  test('with success - 200', async () => {
    const res = await request.get('/ths/stores/football');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Update single store', () => {
  test('with no auth - 401', async () => {
    const res = await request.put('/ths/stores/football');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid store - 404', async () => {
    const res = await request
      .put('/ths/stores/invalid')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing store slug - 409', async () => {
    const res = await request
      .put('/ehs/stores/football')
      .send({
        slug: 'baseball',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .put('/ehs/stores/football')
      .send({
        name: 'Football Store',
        slug: 'football1',
        color: 'red',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Archive store', () => {
  test('with no auth - 401', async () => {
    const res = await request.delete('/ths/stores/invalid');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid store - 404', async () => {
    const res = await request
      .delete('/ths/stores/invalid')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with open active wave', async () => {
    const res = await request
      .delete('/ths/stores/football')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .delete('/ths/stores/wave')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
