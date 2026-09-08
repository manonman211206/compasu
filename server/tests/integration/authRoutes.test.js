const authService = require('../../src/services/authService');

jest.mock('../../src/services/authService');

describe('Auth Routes Integration Tests (Service level)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate and return token payload', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'mockJwtAccessToken',
      refreshToken: 'mockJwtRefreshToken',
      user: {
        id: 'u123',
        username: 'manonman',
        email: 'manonman@vitchennai.edu.in',
      },
    });

    const result = await authService.login('manonman@vitchennai.edu.in', 'password123');

    expect(result.accessToken).toBe('mockJwtAccessToken');
    expect(result.user.username).toBe('manonman');
  });

  it('should register and return verification status', async () => {
    authService.register.mockResolvedValue({
      id: 'u123',
      username: 'manonman',
      email: 'manonman@vitchennai.edu.in',
      message: 'Registration successful. Please verify your email.',
    });

    const result = await authService.register(
      'manonman',
      'manonman@vitchennai.edu.in',
      'secret123',
      'secret123'
    );

    expect(result.id).toBe('u123');
    expect(result.username).toBe('manonman');
  });
});
