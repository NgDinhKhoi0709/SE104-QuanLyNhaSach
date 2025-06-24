const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

// Mock authService
jest.mock('../../services/authService');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockCredentials = {
        username: 'testuser',
        password: 'testpassword'
      };
      
      const mockResult = {
        user: {
          id: 1,
          username: 'testuser',
          role: 'admin'
        },
        token: 'mock-jwt-token'
      };

      req.body = mockCredentials;
      authService.authenticateUser.mockResolvedValue(mockResult);

      await authController.login(req, res);

      expect(authService.authenticateUser).toHaveBeenCalledWith(
        mockCredentials.username,
        mockCredentials.password
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Đăng nhập thành công',
        user: mockResult.user,
        token: mockResult.token
      });
    });

    it('should return 400 when username is missing', async () => {
      req.body = {
        password: 'testpassword'
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu'
      });
      expect(authService.authenticateUser).not.toHaveBeenCalled();
    });

    it('should return 400 when password is missing', async () => {
      req.body = {
        username: 'testuser'
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu'
      });
      expect(authService.authenticateUser).not.toHaveBeenCalled();
    });

    it('should return 400 when both username and password are missing', async () => {
      req.body = {};

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu'
      });
      expect(authService.authenticateUser).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid credentials', async () => {
      const mockCredentials = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      req.body = mockCredentials;
      const errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
      authService.authenticateUser.mockRejectedValue(new Error(errorMessage));

      await authController.login(req, res);

      expect(authService.authenticateUser).toHaveBeenCalledWith(
        mockCredentials.username,
        mockCredentials.password
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should handle validation errors with 400 status', async () => {
      const mockCredentials = {
        username: 'testuser',
        password: 'testpassword'
      };

      req.body = mockCredentials;
      const errorMessage = 'Vui lòng cung cấp email hợp lệ';
      authService.authenticateUser.mockRejectedValue(new Error(errorMessage));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should handle empty strings as missing values', async () => {
      req.body = {
        username: '',
        password: ''
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu'
      });
    });    it('should handle whitespace-only values as missing', async () => {
      req.body = {
        username: '   ',
        password: '   '
      };

      // Mock authService để throw error như thực tế
      authService.authenticateUser.mockRejectedValue(
        new Error('Vui lòng cung cấp tên đăng nhập và mật khẩu')
      );

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu'
      });
    });
  });
  describe('validateToken', () => {    it('should validate token successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        role: 'admin',
        is_active: 1  // Thêm trường này
      };

      req.user = { id: 1 };
      
      // Mock userModel.getUserById trực tiếp
      const userModel = require('../../models/userModel');
      userModel.getUserById = jest.fn().mockResolvedValue(mockUser);

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token hợp lệ',
        user: mockUser
      });
    });

    it('should return 404 when user not found', async () => {
      req.user = { id: 999 };
      
      const userModel = require('../../models/userModel');
      userModel.getUserById = jest.fn().mockResolvedValue(null);

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Không tìm thấy thông tin người dùng'
      });
    });

    it('should return 403 when account is locked', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        role: 'admin',
        is_active: 0  // Tài khoản bị khóa
      };

      req.user = { id: 1 };
      
      const userModel = require('../../models/userModel');
      userModel.getUserById = jest.fn().mockResolvedValue(mockUser);

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
      });
    });

    it('should handle errors in validateToken', async () => {
      req.user = { id: 1 };
      
      const userModel = require('../../models/userModel');
      userModel.getUserById = jest.fn().mockRejectedValue(new Error('Database error'));

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Lỗi xác thực token: Database error'
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Đăng xuất thành công'
      });    });
  });
});
