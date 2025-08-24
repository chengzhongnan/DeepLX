import request from 'supertest';
import { createTestServer } from './test-server';

describe('Authentication', () => {
  const app = createTestServer();

  it('should accept token in query parameter', async () => {
    const response = await request(app)
      .post('/translate?token=test-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    // Should not be 401, might be 404 due to empty text or 503 due to translation failure
    expect(response.status).not.toBe(401);
  });

  it('should accept Bearer token in Authorization header', async () => {
    const response = await request(app)
      .post('/translate')
      .set('Authorization', 'Bearer test-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    // Should not be 401, might be 404 due to empty text or 503 due to translation failure
    expect(response.status).not.toBe(401);
  });

  it('should accept DeepL-Auth-Key token in Authorization header', async () => {
    const response = await request(app)
      .post('/translate')
      .set('Authorization', 'DeepL-Auth-Key test-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    // Should not be 401, might be 404 due to empty text or 503 due to translation failure
    expect(response.status).not.toBe(401);
  });
});