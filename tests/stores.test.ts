import supertest from 'supertest';
import app from '../src/app';

const request = supertest.agent(app);

describe('List all stores with', () => {
  test('Success - 200', async () => {
    const res = await request.get('/stores');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
  });
});

describe('List store with', () => {
  const invalidStores: string[] = [
      'test',
      '123',
      '614f4c2eebd6b9e9d6aa4560'
  ];

  const validStores: string[] = [
      'wildcats',
      '614f4c2eebd6b9e9d6aa4561'
  ]

  test.each(invalidStores)('Invalid slug or id - 404', async (storeId) => {
    const res = await request.get(`/stores/${storeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBeFalsy();
  });

  test.each(validStores)('Valid slug or id', async (storeId) => {
      const res = await request.get(`/stores/${storeId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBeTruthy();
  })
})
