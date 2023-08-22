import supertest from 'supertest';
import app from '../src/app';

const request = supertest.agent(app);

describe('List all categories in a store with', () => {
  const invalidStores: string[] = ['test', '123', '614f4c2eebd6b9e9d6aa4560'];

  test.each(invalidStores)('Invalid store - 404', async (id) => {
    const res = await request.get(`/categories/${id}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test('Closed store - 403', async () => {
    const res = await request.get('/categories/panthers');

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBeFalsy();
  });

  test('Success - 200', async () => {
    const res = await request.get('/categories/wildcats');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});
