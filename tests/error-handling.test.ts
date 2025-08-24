import request from 'supertest';
import { createTestServer } from './test-server';

describe('Error Handling', () => {
  const app = createTestServer();

  it('should return 404 for undefined paths', async () => {
    const response = await request(app).get('/undefined-path');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 404);
    expect(response.body).toHaveProperty('message', 'Path not found');
  });

  it('should return 404 for undefined POST paths', async () => {
    const response = await request(app).post('/undefined-path');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('code', 404);
    expect(response.body).toHaveProperty('message', 'Path not found');
  });
});