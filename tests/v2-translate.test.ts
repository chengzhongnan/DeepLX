import request from 'supertest';
import { createTestServer } from './test-server';

describe('POST /v2/translate', () => {
  const app = createTestServer();

  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .post('/v2/translate')
      .send({
        text: 'Hello World',
        target_lang: 'ZH'
      });
    expect(response.status).toBe(401);
  });

  it('should return 400 with invalid request payload', async () => {
    const response = await request(app)
      .post('/v2/translate')
      .set('Authorization', 'Bearer test-token')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should handle JSON format', async () => {
    const response = await request(app)
      .post('/v2/translate')
      .set('Authorization', 'Bearer test-token')
      .send({
        text: ['Hello World'],
        target_lang: 'ZH'
      });
    // This might return 503 due to actual translation failure, but should not be 400
    expect([200, 503]).toContain(response.status);
  });
});