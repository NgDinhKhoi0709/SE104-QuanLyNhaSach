import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock authService
const mockValidateToken = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../services/authService', () => ({
  validateToken: () => mockValidateToken(),
  login: (username, password) => mockLogin(username, password),
  logout: () => mockLogout()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock alert
window.alert = jest.fn();

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it('initializes with null user and loading false after initial load', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBe(null);
    
    // Wait for loading to become false after initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
  });

  it('loads user from localStorage on mount', async () => {
    const mockUser = { id: 1, username: 'testuser', is_active: 1 };
    const mockToken = 'mock-token';
    
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);
    
    mockValidateToken.mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for useEffect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('handles inactive user from server validation', async () => {
    const mockUser = { id: 1, username: 'testuser', is_active: 1 };
    const mockInactiveUser = { ...mockUser, is_active: 0 };
    const mockToken = 'mock-token';
    
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);
    
    mockValidateToken.mockResolvedValueOnce(mockInactiveUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('handles token validation failure', async () => {
    const mockUser = { id: 1, username: 'testuser', is_active: 1 };
    const mockToken = 'invalid-token';
    
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);
    
    mockValidateToken.mockRejectedValueOnce(new Error('Token invalid'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // The AuthContext keeps the user even if token validation fails
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('logs in user successfully', async () => {
    const mockCredentials = 'testuser';
    const mockPassword = 'password';
    const mockResponse = {
      user: { id: 1, username: 'testuser', role_id: 1 },
      token: 'new-token'
    };

    mockLogin.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(mockCredentials, mockPassword);
    });

    expect(mockLogin).toHaveBeenCalledWith(mockCredentials, mockPassword);
    expect(result.current.user).toEqual(mockResponse.user);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
  });

  it('handles login failure', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('wronguser', 'wrongpass');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.user).toBe(null);
  });

  it('logs out user successfully', async () => {
    // First set a user by mocking localStorage
    const mockUser = { id: 1, username: 'testuser' };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Then logout
    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  it('provides auth context value', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('getRoleBasedRedirect');
    expect(result.current).toHaveProperty('getRoleLabel');
  });
});
