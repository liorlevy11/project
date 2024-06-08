const request = require('supertest');
const app = require('../server/Server'); // Adjust the path as needed

describe('API Endpoints', () => {
  test('should register a new user', async () => {
    const response = await request(app).post('/register').send({
      email: 'newuser2@example.com',
      password: 'Password123!',
      name: 'New User'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('should login successfully', async () => {
    await request(app).post('/register').send({
      email: 'testlogin@example.com',
      password: 'Password123!',
      name: 'Test Login'
    });

    const response = await request(app).post('/login').send({
      email: 'testlogin@example.com',
      password: 'Password123!'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  test('should fail login with wrong credentials', async () => {
    await request(app).post('/register').send({
      email: 'testlogin2@example.com',
      password: 'Password123!',
      name: 'Test Login 2'
    });

    const response = await request(app).post('/login').send({
      email: 'testlogin2@example.com',
      password: 'WrongPassword!'
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });
});
