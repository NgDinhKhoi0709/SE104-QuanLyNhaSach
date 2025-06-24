const authService = require('../../services/authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db');

// Mock dependencies
jest.mock('../../db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should throw error when username is missing', async () => {
      await expect(authService.authenticateUser('', 'password123')).rejects.toThrow('Vui lòng cung cấp tên đăng nhập và mật khẩu');
    });

    it('should throw error when password is missing', async () => {
      await expect(authService.authenticateUser('user1', '')).rejects.toThrow('Vui lòng cung cấp tên đăng nhập và mật khẩu');
    });

    it('should throw error when both username and password are missing', async () => {
      await expect(authService.authenticateUser('', '')).rejects.toThrow('Vui lòng cung cấp tên đăng nhập và mật khẩu');
    });

    it('should throw error when user not found', async () => {
      db.query.mockResolvedValue([[]]);

      await expect(authService.authenticateUser('nonexistent', 'password123')).rejects.toThrow('Tên đăng nhập và/hoặc mật khẩu không đúng');
    });

    it('should throw error when user account is inactive', async () => {
      const mockUser = {
        id: 1,
        username: 'user1',
        password: 'hashedpassword',
        full_name: 'Test User',
        role_id: 2,
        is_active: 0
      };
      db.query.mockResolvedValue([[mockUser]]);

      await expect(authService.authenticateUser('user1', 'password123')).rejects.toThrow('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
    });

    it('should authenticate admin user with plain text password', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        password: 'admin123',
        full_name: 'Administrator',
        role_id: 1,
        is_active: 1
      };
      db.query.mockResolvedValue([[mockUser]]);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.authenticateUser('admin', 'admin123');

      expect(result.user).toEqual({
        id: 1,
        username: 'admin',
        full_name: 'Administrator',
        role_id: 1,
        is_active: 1
      });
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw error for admin user with wrong password', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        password: 'admin123',
        full_name: 'Administrator',
        role_id: 1,
        is_active: 1
      };
      db.query.mockResolvedValue([[mockUser]]);

      await expect(authService.authenticateUser('admin', 'wrongpassword')).rejects.toThrow('Tên đăng nhập và/hoặc mật khẩu không đúng');
    });

    it('should authenticate regular user with bcrypt password', async () => {
      const mockUser = {
        id: 2,
        username: 'user1',
        password: '$2b$10$hashedpassword',
        full_name: 'Test User',
        role_id: 2,
        is_active: 1
      };
      db.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.authenticateUser('user1', 'password123');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', '$2b$10$hashedpassword');
      expect(result.user).toEqual({
        id: 2,
        username: 'user1',
        full_name: 'Test User',
        role_id: 2,
        is_active: 1
      });
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw error when bcrypt password does not match', async () => {
      const mockUser = {
        id: 2,
        username: 'user1',
        password: '$2b$10$hashedpassword',
        full_name: 'Test User',
        role_id: 2,
        is_active: 1
      };
      db.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.authenticateUser('user1', 'wrongpassword')).rejects.toThrow('Tên đăng nhập và/hoặc mật khẩu không đúng');
    });

    it('should handle bcrypt error and throw custom error', async () => {
      const mockUser = {
        id: 2,
        username: 'user1',
        password: '$2b$10$hashedpassword',
        full_name: 'Test User',
        role_id: 2,
        is_active: 1
      };
      db.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockRejectedValue(new Error('Invalid hash format'));

      await expect(authService.authenticateUser('user1', 'password123')).rejects.toThrow('Lỗi xác thực: Định dạng mật khẩu không hợp lệ');
    });

    it('should handle database errors', async () => {
      db.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(authService.authenticateUser('user1', 'password123')).rejects.toThrow('Database connection failed');
    });
  });

  describe('generateToken', () => {
    it('should generate JWT token with correct payload', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        role_id: 2
      };
      jwt.sign.mockReturnValue('mock-jwt-token');

      const result = authService.generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, username: 'testuser', role_id: 2 },
        'yoursecretkey123',
        { expiresIn: '24h' }
      );
      expect(result).toBe('mock-jwt-token');
    });
  });

  describe('verifyToken', () => {
    it('should throw error when token is missing', () => {
      expect(() => authService.verifyToken('')).toThrow('Không tìm thấy token xác thực');
      expect(() => authService.verifyToken(null)).toThrow('Không tìm thấy token xác thực');
      expect(() => authService.verifyToken(undefined)).toThrow('Không tìm thấy token xác thực');
    });

    it('should verify valid token successfully', () => {
      const mockDecoded = {
        id: 1,
        username: 'testuser',
        role_id: 2,
        iat: 1234567890,
        exp: 1234654290
      };
      jwt.verify.mockReturnValue(mockDecoded);

      const result = authService.verifyToken('valid-jwt-token');

      expect(jwt.verify).toHaveBeenCalledWith('valid-jwt-token', 'yoursecretkey123');
      expect(result).toEqual(mockDecoded);
    });

    it('should throw error for invalid token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('JsonWebTokenError: invalid token');
      });

      expect(() => authService.verifyToken('invalid-token')).toThrow('Token không hợp lệ hoặc đã hết hạn');
    });

    it('should throw error for expired token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('TokenExpiredError: jwt expired');
      });

      expect(() => authService.verifyToken('expired-token')).toThrow('Token không hợp lệ hoặc đã hết hạn');
    });
  });
});
