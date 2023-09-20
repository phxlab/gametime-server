import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030/org');

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
