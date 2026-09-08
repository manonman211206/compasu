import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { loginSuccess, logout, setUser } from '../store/authSlice';

describe('authSlice Redux Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    const initialState = authReducer(undefined, { type: 'unknown' });
    expect(initialState.user).toBeNull();
  });

  it('should handle loginSuccess', () => {
    const actionPayload = {
      accessToken: 'testAccessToken',
      refreshToken: 'testRefreshToken',
      user: { id: 'u1', username: 'manonman' },
    };

    const state = authReducer(undefined, loginSuccess(actionPayload));

    expect(state.token).toBe('testAccessToken');
    expect(state.refreshToken).toBe('testRefreshToken');
    expect(state.user.username).toBe('manonman');
    expect(localStorage.getItem('token')).toBe('testAccessToken');
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: 'u1', username: 'manonman' },
      token: 'someToken',
      refreshToken: 'someRefreshToken',
      loading: false,
      error: null,
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
