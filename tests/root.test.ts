import request from 'supertest';
import { createTestServer } from './test-server';

describe('GET /', () => {
  const app = createTestServer();

  it('should return API information', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('DeepL Free API');
  });
});