import request from 'supertest';
import { createTestServer } from './test-server';

describe('POST /translate', () => {
  const app = createTestServer();

  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .post('/translate')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    expect(response.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    const response = await request(app)
      .post('/translate')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    expect(response.status).toBe(401);
  });

  it('should return 400 with invalid tag_handling', async () => {
    const response = await request(app)
      .post('/translate')
      .set('Authorization', 'Bearer test-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH',
        tag_handling: 'invalid'
      });
    expect(response.status).toBe(400);
  });

  it('should return 404 with empty text', async () => {
    const response = await request(app)
      .post('/translate')
      .set('Authorization', 'Bearer test-token')
      .send({
        text: '',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    expect(response.status).toBe(404);
  });
});