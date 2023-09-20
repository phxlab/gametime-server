import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030/auth');

describe('Login user', () => {
  test('with no data', async () => {
    const res = await request.post('/login').send();

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with no password - 400', async () => {
    const res = await request.post('/login').send({
      username: 'test',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with no username - 400', async () => {
    const res = await request.post('/login').send({
      password: 'test',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid credentials - 401', async () => {
    const res = await request.post('/login').send({
      username: 'test',
      password: 'test',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.post('/login').send({
      username: 'john',
      password: 'password',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toBeString();
  });
});

describe('Get current user', () => {
  test('with no auth - 401', async () => {
    const res = await request.get('/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with bad token - 401', async () => {
    const res = await request
      .get('/me')
      .auth(
        'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY1MDZmNWQ2YzI5N2FmZTgwOTMxMmM1YiIsImV4cCI6MTY5NzU0Njk2Nn0.HTjiJPXYla6DMKm_tpfesJHTdsvf7WdTG1u4DKD2fpQ',
        { type: 'bearer' },
      );

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with non bearer token - 401', async () => {
    const res = await request.get('/me').set('Authorization', global.__token);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request
      .get('/me')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
