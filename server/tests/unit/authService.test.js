const authService = require('../../src/services/authService');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/utils/email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
}));

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret';
    process.env.JWT_REFRESH_SECRET = 'testrefreshsecret';
  });

  describe('register', () => {
    it('should throw error if passwords do not match', async () => {
      await expect(
        authService.register('testuser', 'test@vitchennai.edu.in', 'password123', 'different')
      ).rejects.toThrow('Passwords do not match');
    });

    it('should throw error if user already exists', async () => {
      User.findOne.mockResolvedValue({ _id: '123', email: 'test@vitchennai.edu.in' });

      await expect(
        authService.register('testuser', 'test@vitchennai.edu.in', 'password123', 'password123')
      ).rejects.toThrow('User with this email or username already exists');
    });

    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const mockSavedUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@vitchennai.edu.in',
        save: jest.fn().mockResolvedValue(true),
      };
      User.mockImplementation(() => mockSavedUser);

      const result = await authService.register(
        'testuser',
        'test@vitchennai.edu.in',
        'password123',
        'password123'
      );

      expect(result).toHaveProperty('id', 'user123');
      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('email', 'test@vitchennai.edu.in');
    });
  });

  describe('login', () => {
    it('should throw error if user does not exist', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        authService.login('notfound@vitchennai.edu.in', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password does not match', async () => {
      User.findOne.mockResolvedValue({
        email: 'test@vitchennai.edu.in',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login('test@vitchennai.edu.in', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return access and refresh tokens on valid credentials', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@vitchennai.edu.in',
        password: 'hashedPassword',
        refreshTokens: [],
        save: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign
        .mockReturnValueOnce('mockAccessToken')
        .mockReturnValueOnce('mockRefreshToken');

      const result = await authService.login('test@vitchennai.edu.in', 'password123');

      expect(result).toHaveProperty('accessToken', 'mockAccessToken');
      expect(result).toHaveProperty('refreshToken', 'mockRefreshToken');
      expect(result.user).toHaveProperty('username', 'testuser');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
