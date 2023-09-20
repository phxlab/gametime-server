import { describe, expect, test } from 'bun:test';
import r from 'supertest';

const request = r('http://localhost:3030/orgs');

describe('Create org', () => {
  const validOrg = {
    name: 'Wildcats School',
    slug: 'wildcats',
  };

  test('with no auth - 401', async () => {
    const res = await request.post('').send(validOrg);

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with no name - 400', async () => {
    const res = await request
      .post('')
      .send({
        slug: 'wildcats',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with no slug - 400', async () => {
    const res = await request
      .post('')
      .send({
        name: 'Wildcats High School',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid slug - 400', async () => {
    const res = await request
      .post('')
      .send({
        name: 'Wildcats High School',
        slug: 'Wildcats High School',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('with existing slug - 409', async () => {
    const res = await request
      .post('')
      .send({
        name: 'Wildcats High School',
        slug: 'ehs',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBeFalsy();
  });

  test('success - 201', async () => {
    const res = await request
      .post('')
      .send(validOrg)
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get all orgs', () => {
  test('with no auth - 401', async () => {
    const res = await request.get('');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('success - 200', async () => {
    const res = await request.get('').auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Get single org', () => {
  test('with invalid slug - 404', async () => {
    const res = await request.get('/invalid');

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('with success - 200', async () => {
    const res = await request.get('/ehs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Update single org', () => {
  test('with no auth - 401', async () => {
    const res = await request.put('/wildcats').send({
      name: 'Wildcats High School',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with no data - 400', async () => {
    const res = await request
      .put('/wildcats')
      .send()
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
  });

  test('without updating slug - 200', async () => {
    const res = await request
      .put('/wildcats')
      .send({
        name: 'Wildcats High School',
        slug: 'whs',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.slug).toBe('wildcats');
  });

  test('with success - 200', async () => {
    const res = await request
      .put('/wildcats')
      .send({
        name: 'Wildcats High School',
      })
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('Delete single org', () => {
  test('with no auth - 401', async () => {
    const res = await request.delete('/wildcats');

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
  });

  test('with invalid slug - 404', async () => {
    const res = await request
      .delete('/invalid')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('success - 200', async () => {
    const res = await request
      .delete('/wildcats')
      .auth(global.__token, { type: 'bearer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
