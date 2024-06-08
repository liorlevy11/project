const request = require('supertest');
const app = require('../server/Server'); // Adjust the path as needed

describe('Logout Functionality', () => {
  beforeAll(async () => {
    await request(app).post('/register').send({
      email: 'logoutuser@example.com',
      password: 'Password123!',
      name: 'Logout User'
    });
    await request(app).post('/login').send({
      email: 'logoutuser@example.com',
      password: 'Password123!'
    });
  });

  test('should logout successfully', async () => {
    const response = await request(app).post('/logout').send({
      email: 'logoutuser@example.com'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});
