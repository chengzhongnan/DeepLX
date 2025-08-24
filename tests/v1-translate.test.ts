import request from 'supertest';
import { createTestServer } from './test-server';

describe('POST /v1/translate', () => {
  const app = createTestServer();

  it('should return 401 when no dl_session is provided', async () => {
    const response = await request(app)
      .post('/v1/translate')
      .set('Authorization', 'Bearer test-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    expect(response.status).toBe(401);
  });

  it('should return 401 when dl_session is invalid (contains dot)', async () => {
    const response = await request(app)
      .post('/v1/translate')
      .set('Authorization', 'Bearer test-token')
      .set('Cookie', 'dl_session=invalid.token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    expect(response.status).toBe(401);
  });

  it('should return 400 with invalid tag_handling', async () => {
    const response = await request(app)
      .post('/v1/translate')
      .set('Authorization', 'Bearer test-token')
      .set('Cookie', 'dl_session=valid-session')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH',
        tag_handling: 'invalid'
      });
    expect(response.status).toBe(400);
  });
});