import request from 'supertest';
import { createTestServer } from './test-server';

describe('API Integration Tests', () => {
  const app = createTestServer();

  it('should handle complete API workflow', async () => {
    // Test root endpoint
    const rootResponse = await request(app).get('/');
    expect(rootResponse.status).toBe(200);
    expect(rootResponse.body.message).toContain('DeepL Free API');

    // Test authentication with valid token
    const authResponse = await request(app)
      .post('/translate?token=test-token')
      .send({
        text: 'Hello World',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    // Should not be authentication error
    expect(authResponse.status).not.toBe(401);
    
    // Test v2 endpoint with valid token
    const v2Response = await request(app)
      .post('/v2/translate?token=test-token')
      .send({
        text: 'Hello World',
        target_lang: 'ZH'
      });
    // Should not be authentication error
    expect(v2Response.status).not.toBe(401);
  });

  it('should handle all error cases properly', async () => {
    // Test undefined path
    const undefinedResponse = await request(app).get('/nonexistent');
    expect(undefinedResponse.status).toBe(404);

    // Test invalid token
    const invalidTokenResponse = await request(app)
      .post('/translate')
      .set('Authorization', 'Bearer invalid')
      .send({
        text: 'Hello',
        source_lang: 'EN',
        target_lang: 'ZH'
      });
    expect(invalidTokenResponse.status).toBe(401);

    // Test invalid tag handling
    const invalidTagResponse = await request(app)
      .post('/translate?token=test-token')
      .send({
        text: 'Hello',
        source_lang: 'EN',
        target_lang: 'ZH',
        tag_handling: 'invalid'
      });
    expect(invalidTagResponse.status).toBe(400);
  });
});