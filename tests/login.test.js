const userController = require('../service/userControler');

describe('User Controller - Login', () => {
  beforeAll(async () => {
    await userController.register('test@example.com', 'Password123!', 'Test User');
  });

  test('should login with correct credentials', async () => {
    await expect(userController.login('test@example.com', 'Password123!')).resolves.not.toThrow();
  });

  test('should fail login with incorrect email', async () => {
    await expect(userController.login('wrong@example.com', 'Password123!')).rejects.toThrow('Invalid email');
  });

  test('should fail login with incorrect password', async () => {
    await expect(userController.login('test@example.com', 'WrongPassword!')).rejects.toThrow('Invalid password');
  });
  test('should fail login with unregistered email', async () => {
    await expect(userController.login('unregistered@example.com', 'Password123!')).rejects.toThrow('Invalid email');
  });

  test('should fail login with missing email', async () => {
    await expect(userController.login('', 'Password123!')).rejects.toThrow('Invalid email');
  });

  test('should fail login with missing password', async () => {
    await expect(userController.login('test@example.com', '')).rejects.toThrow('Invalid password');
  });

  test('should fail login with invalid email format', async () => {
    await expect(userController.login('invalid-email', 'Password123!')).rejects.toThrow('Invalid email');
  });

  test('should fail login with null password', async () => {
    await expect(userController.login('test@example.com', null)).rejects.toThrow('Invalid password');
  });

  test('should fail login with short password', async () => {
    await expect(userController.login('test@example.com', 'short')).rejects.toThrow('Invalid password');
  });

  test('should logout successfully', async () => {
    await userController.login('test@example.com', 'Password123!');
    userController.logout('test@example.com');
    expect(userController.isLogin('test@example.com')).toBeFalsy();
  });

  test('should check if user is logged in', async () => {
    await userController.login('test@example.com', 'Password123!');
    expect(userController.isLogin('test@example.com')).toBeTruthy();
    userController.logout('test@example.com');
  });

  test('should get user data after login', async () => {
    await userController.login('test@example.com', 'Password123!');
    const userData = userController.getUserData('test@example.com');
    expect(userData).toEqual(expect.objectContaining({
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123!'
    }));
    userController.logout('test@example.com');
  });

});
