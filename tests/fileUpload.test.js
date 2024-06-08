const service = require('../service/Service');
const userController = require('../service/userControler');
const filesController = require('../service/filesControler');

jest.mock('../service/userControler');
jest.mock('../service/filesControler');

describe('Service - upLoadFile', () => {
  const testEmail = 'test@example.com';
  const testFile = { name: 'testFile.txt' };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  beforeAll(() => {
    // Setup necessary mocks for userController and filesController
    userController.isLogin = jest.fn();
    // Remove the model parameter from the mock implementation
    filesController.upLoadFile = jest.fn((email, file, callback) => {
      callback('File uploaded successfully');
    });
  });

  test('should upload file when user is logged in', async () => {
    userController.isLogin.mockReturnValue(true);

    // The mock implementation should now correctly receive the callback function
    await expect(service.upLoadFile(testEmail, testFile)).resolves.toEqual('File uploaded successfully');
    // The assertion should now expect two arguments instead of three
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, testFile, expect.any(Function));
  });

  test('should fail to upload file when user is not logged in', async () => {
    userController.isLogin.mockReturnValue(false);

    await expect(service.upLoadFile(testEmail, testFile)).rejects.toThrow('Have to be logged in first');
    expect(filesController.upLoadFile).not.toHaveBeenCalled();
  });


  test('should throw an error if the file has no name', async () => {
    userController.isLogin.mockReturnValue(true);
    const fileWithoutName = {};

    await expect(service.upLoadFile(testEmail, fileWithoutName)).rejects.toThrow('File must have a name');
    expect(filesController.upLoadFile).not.toHaveBeenCalled();
  });


  test('should throw an error if the email is invalid', async () => {
    userController.isLogin.mockReturnValue(true);
    const invalidEmail = 'invalid-email';

    await expect(service.upLoadFile(invalidEmail, testFile)).rejects.toThrow('Invalid email format');
    expect(filesController.upLoadFile).not.toHaveBeenCalled();
  });


  test('should handle a null result from filesController.upLoadFile', async () => {
    userController.isLogin.mockReturnValue(true);
    filesController.upLoadFile.mockImplementation((email, file, callback) => {
      callback(null);
    });

    await expect(service.upLoadFile(testEmail, testFile)).rejects.toThrow('File upload returned null result');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, testFile, expect.any(Function));
  });

  test('should handle an empty string result from filesController.upLoadFile', async () => {
    userController.isLogin.mockReturnValue(true);
    filesController.upLoadFile.mockImplementation((email, file, callback) => {
      callback('');
    });

    await expect(service.upLoadFile(testEmail, testFile)).rejects.toThrow('File upload returned empty result');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, testFile, expect.any(Function));
  });

  test('should handle a non-string result from filesController.upLoadFile', async () => {
    userController.isLogin.mockReturnValue(true);
    filesController.upLoadFile.mockImplementation((email, file, callback) => {
      callback({ message: 'Non-string result' });
    });

    await expect(service.upLoadFile(testEmail, testFile)).rejects.toThrow('File upload returned non-string result');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, testFile, expect.any(Function));
  });

  test('should handle a file upload error from filesController.upLoadFile', async () => {
    userController.isLogin.mockReturnValue(true);
    filesController.upLoadFile.mockImplementation((email, file, callback) => {
      throw new Error('File upload error');
    });

    await expect(service.upLoadFile(testEmail, testFile)).rejects.toThrow('File upload error');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, testFile, expect.any(Function));
  });

    test('should handle a file upload exception from filesController.upLoadFile', async () => {
      userController.isLogin.mockReturnValue(true);
      filesController.upLoadFile.mockImplementation((email, file, callback) => {
        throw new Error('File upload exception'); // This should throw an exception
      });

      await expect(service.upLoadFile(testEmail, testFile)).rejects.toThrow('File upload exception');
      expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, testFile, expect.any(Function));
    });
  test('should handle choosing a file then choosing it again', async () => {
    userController.isLogin.mockReturnValue(true);
    const file = { name: 'testFile.txt' };
    await expect(service.upLoadFile(testEmail, file)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file, expect.any(Function));
    await expect(service.upLoadFile(testEmail, file)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file, expect.any(Function));
  });
  test('should handle choosing file then choosing another file', async () => {
    userController.isLogin.mockReturnValue(true);
    const file1 = { name: 'testFile1.txt' };
    const file2 = { name: 'testFile2.txt' };
    await expect(service.upLoadFile(testEmail, file1)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file1, expect.any(Function));
    await expect(service.upLoadFile(testEmail, file2)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file2, expect.any(Function));
  });
  //test changing model option
  test('should handle changing model option', async () => {
    userController.isLogin.mockReturnValue(true);
    const file = { name: 'testFile.txt' };
    const model = 'model2';
    await expect(service.upLoadFile(testEmail, file, model)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file, model, expect.any(Function));
  });
  test('should handle changing model option then changing it again', async () => {
    userController.isLogin.mockReturnValue(true);
    const file = { name: 'testFile.txt' };
    const model1 = 'model1';
    const model2 = 'model2';
    await expect(service.upLoadFile(testEmail, file, model1)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file, model1, expect.any(Function));
    await expect(service.upLoadFile(testEmail, file, model2)).resolves.toEqual('File uploaded successfully');
    expect(filesController.upLoadFile).toHaveBeenCalledWith(testEmail, file, model2, expect.any(Function));
  });


});
