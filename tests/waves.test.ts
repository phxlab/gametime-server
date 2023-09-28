import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030/orgs');

describe('Create wave', () => {
  test('with no auth - 401', async () => {
    const res = await request.post('/ths/stores/football/waves');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid store - 404', async () => {
    const res = await request
      .post('/ths/stores/invalid/waves')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing wave - 409', async () => {
    const res = await request
      .post('/ths/stores/football/waves')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 400', async () => {
    const res = await request
      .post('/ths/stores/wave/waves')
      .send({})
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.message).toContain('Name');
    expect(res.body.message).toContain('open');
    expect(res.body.message).toContain('close');
  });

  test('with success - 201', async () => {
    const res = await request
      .post('/ths/stores/wave/waves')
      .send({
        name: 'Test Creation',
        open: '2025-09-27T00:00:00',
        close: '2025-09-30T00:00:00',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });
});
