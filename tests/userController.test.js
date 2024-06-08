const userController = require('../service/userControler');

describe('User Controller', () => {
  test('should register a new user', async () => {
    await expect(userController.register('newuser@example.com', 'Password123!', 'New User')).resolves.not.toThrow();
  });

  test('should not allow duplicate registration', async () => {
    await userController.register('duplicateuser@example.com', 'Password123!', 'Duplicate User');
    await expect(userController.register('duplicateuser@example.com', 'Password123!', 'Duplicate User')).rejects.toThrow('User with this mail already exists');
  });

  test('should login with correct credentials', async () => {
    await userController.register('loginuser@example.com', 'Password123!', 'Login User');
    await expect(userController.login('loginuser@example.com', 'Password123!')).resolves.not.toThrow();
  });

  test('should fail login with incorrect email', async () => {
    await expect(userController.login('wrongemail@example.com', 'Password123!')).rejects.toThrow('Invalid email');
  });

  test('should fail login with incorrect password', async () => {
    await userController.register('passworduser@example.com', 'Password123!', 'Password User');
    await expect(userController.login('passworduser@example.com', 'WrongPassword!')).rejects.toThrow('Invalid password');
  });
  test('should not allow registration with missing email', async () => {
    await expect(userController.register('', 'Password123!', 'No Email User')).rejects.toThrow('Missing required attributes');
  });

  test('should not allow registration with missing password', async () => {
    await expect(userController.register('noemail@example.com', '', 'No Password User')).rejects.toThrow('Missing required attributes');
  });

  test('should not allow registration with missing name', async () => {
    await expect(userController.register('noname@example.com', 'Password123!', '')).rejects.toThrow('Missing required attributes');
  });


  test('should logout successfully', async () => {
    await userController.register('logoutuser@example.com', 'Password123!', 'Logout User');
    await userController.login('logoutuser@example.com', 'Password123!');
    userController.logout('logoutuser@example.com');
    expect(userController.isLogin('logoutuser@example.com')).toBeFalsy();
  });

  test('should check if user is logged in', async () => {
    await userController.register('loggedinuser@example.com', 'Password123!', 'Logged In User');
    await userController.login('loggedinuser@example.com', 'Password123!');
    expect(userController.isLogin('loggedinuser@example.com')).toBeTruthy();
    userController.logout('loggedinuser@example.com');
  });

  test('should get user data after registration', async () => {
    const email = 'userdata@example.com';
    const password = 'Password123!';
    const name = 'User Data';
    await userController.register(email, password, name);
    const userData = userController.getUserData(email);
    expect(userData).toEqual(expect.objectContaining({
      email,
      name,
      password
    }));
  });


  test('should not retrieve user data for non-existent user', async () => {
    const email = 'nonexistent@example.com';
    const userData = userController.getUserData(email);
    expect(userData).toBeUndefined();
  });

  test('should return false for login status check of non-existent user', async () => {
    const email = 'nonexistent@example.com';
    expect(userController.isLogin(email)).toBeFalsy();
  });
});
