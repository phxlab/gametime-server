import supertest from 'supertest';
import app from '../src/app.js';

const request = supertest.agent(app);

describe('List all stores with', () => {
  test('Success - 200', async () => {
    const res = await request.get('/stores');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
