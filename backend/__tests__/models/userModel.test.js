const userModel = require('../../models/userModel');
const db = require('../../db');

// Mock the database
jest.mock('../../db');

describe('UserModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'user1',
          full_name: 'User One',
          email: 'user1@example.com',
          phone: '0123456789',
          gender: 1,
          role_id: 2,
          is_active: 1,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        {
          id: 2,
          username: 'user2',
          full_name: 'User Two',
          email: 'user2@example.com',
          phone: '0987654321',
          gender: 0,
          role_id: 1,
          is_active: 1,
          created_at: '2024-01-02',
          updated_at: '2024-01-02'
        }
      ];

      db.query.mockResolvedValue([mockUsers]);

      const result = await userModel.getAllUsers();

      expect(db.query).toHaveBeenCalledWith(
        "SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at, updated_at FROM users"
      );
      expect(result).toEqual(mockUsers);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      db.query.mockRejectedValue(dbError);

      await expect(userModel.getAllUsers()).rejects.toThrow('Database connection failed');
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'hashedpassword',
        full_name: 'New User',
        email: 'new@example.com',
        phone: '0123456789',
        gender: 1,
        role_id: 2,
        is_active: 1
      };

      const mockResult = { insertId: 123, affectedRows: 1 };
      db.query.mockResolvedValue([mockResult]);

      const result = await userModel.createUser(userData);

      expect(db.query).toHaveBeenCalledWith(
        `INSERT INTO users (username, password, full_name, email, phone, gender, role_id, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['newuser', 'hashedpassword', 'New User', 'new@example.com', '0123456789', 1, 2, 1]
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors during creation', async () => {
      const userData = {
        username: 'newuser',
        password: 'hashedpassword',
        full_name: 'New User',
        email: 'new@example.com',
        phone: '0123456789',
        gender: 1,
        role_id: 2,
        is_active: 1
      };

      const dbError = new Error('Duplicate entry');
      db.query.mockRejectedValue(dbError);

      await expect(userModel.createUser(userData)).rejects.toThrow('Duplicate entry');
    });
  });

  describe('getUserById', () => {
    it('should get user by id successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role_id: 2,
        is_active: 1,
        created_at: '2024-01-01'
      };

      db.query.mockResolvedValue([[mockUser]]);

      const result = await userModel.getUserById(1);

      expect(db.query).toHaveBeenCalledWith(
        "SELECT id, username, full_name, email, phone, gender, role_id, is_active, created_at FROM users WHERE id = ?",
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      db.query.mockResolvedValue([[]]);

      const result = await userModel.getUserById(999);

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database error');
      db.query.mockRejectedValue(dbError);

      await expect(userModel.getUserById(1)).rejects.toThrow('Database error');
    });
  });
});
