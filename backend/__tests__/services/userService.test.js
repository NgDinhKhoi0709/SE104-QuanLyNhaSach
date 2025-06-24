const userService = require('../../services/userService');
const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const db = require('../../db');

// Mock dependencies
jest.mock('../../models/userModel');
jest.mock('bcrypt');
jest.mock('../../db');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock db.query for addUser method
    db.query.mockResolvedValue([[{
      id: 1,
      username: 'testuser',
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '0123456789',
      gender: 1,
      role_id: 1,
      is_active: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }]]);
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' }
      ];

      userModel.getAllUsers.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(userModel.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
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

      userModel.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(userModel.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role_id: 2,
        is_active: 1,
        created_at: '2024-01-01'
      });
    });

    it('should handle user not found', async () => {
      userModel.getUserById.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toEqual({
        status: 404,
        message: 'User not found'
      });
    });

    it('should handle user with null/empty fields', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        full_name: null,
        email: null,
        phone: null,
        gender: null,
        role_id: 2,
        is_active: 1,
        created_at: null
      };

      userModel.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result.full_name).toBe('');
      expect(result.email).toBe('');
      expect(result.phone).toBe('');
      expect(result.gender).toBeNull();
      expect(result.created_at).toBeNull();
    });

    it('should handle invalid gender values', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 2, // Invalid gender value
        role_id: 2,
        is_active: 1,
        created_at: '2024-01-01'
      };

      userModel.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result.gender).toBeNull();
    });

    it('should handle gender value 0', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 0,
        role_id: 2,
        is_active: 1,
        created_at: '2024-01-01'
      };

      userModel.getUserById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result.gender).toBe(0);
    });
  });
  describe('addUser', () => {
    beforeEach(() => {
      bcrypt.hash.mockResolvedValue('$2b$10$hashedPassword');
      userModel.createUser.mockResolvedValue({ 
        insertId: 1
      });
    });

    it('should add user successfully with admin role', async () => {
      const userData = {
        username: 'newuser',
        fullName: 'New User',
        email: 'new@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'admin'
      };

      const result = await userService.addUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('12345678', 10);      expect(userModel.createUser).toHaveBeenCalledWith({
        username: 'newuser',
        password: '$2b$10$hashedPassword',
        full_name: 'New User',
        email: 'new@example.com',
        phone: '0123456789',
        gender: 1,
        role_id: 1,
        is_active: 1      });
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role_id: 1,
        is_active: 1,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      });
    });    it('should add user successfully with sales role', async () => {
      const userData = {
        username: 'salesuser',
        fullName: 'Sales User',
        email: 'sales@example.com',
        phone: '0123456789',
        gender: 0,
        role: 'sales'
      };

      await userService.addUser(userData);

      expect(userModel.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ role_id: 2 })
      );
    });    it('should add user successfully with warehouse role', async () => {
      const userData = {
        username: 'warehouseuser',
        fullName: 'Warehouse User',
        email: 'warehouse@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'warehouse'
      };

      await userService.addUser(userData);

      expect(userModel.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ role_id: 3 })
      );
    });

    it('should use default role for unknown role', async () => {
      const userData = {
        username: 'defaultuser',
        fullName: 'Default User',
        email: 'default@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'unknown'
      };

      await userService.addUser(userData);      expect(userModel.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ role_id: 2 })
      );
    });

    it('should throw error for missing username', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'admin'
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should throw error for missing fullName', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'admin'
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should throw error for missing email', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        phone: '0123456789',
        gender: 1,
        role: 'admin'
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should throw error for missing phone', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        gender: 1,
        role: 'admin'
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should throw error for undefined gender', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        role: 'admin'
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should throw error for null gender', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: null,
        role: 'admin'
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should throw error for missing role', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1
      };

      await expect(userService.addUser(userData)).rejects.toEqual({
        status: 400,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should handle bcrypt hash error', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'admin'
      };

      bcrypt.hash.mockRejectedValue(new Error('Hashing failed'));

      await expect(userService.addUser(userData)).rejects.toThrow('Hashing failed');
    });    it('should handle userModel.createUser error', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 1,
        role: 'admin'
      };

      userModel.createUser.mockRejectedValue(new Error('Database error'));

      await expect(userService.addUser(userData)).rejects.toThrow('Database error');
    });
  });
  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userData = {
        username: 'updateduser',
        fullName: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 0,
        role: 'sales'
      };
      
      // Mock checking user exists
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      // Mock update query
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock getting updated user
      db.query.mockResolvedValueOnce([[{
        id: 1,
        username: 'updateduser',
        full_name: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 0,
        role_id: 2,
        is_active: 1
      }]]);

      const result = await userService.updateUser(1, userData);

      expect(result.username).toBe('updateduser');
      expect(result.full_name).toBe('Updated User');
    });    it('should handle updateUser with unknown role', async () => {
      const userData = {
        username: 'updateduser',
        fullName: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 1,
        role: 'unknown'
      };
      
      // Mock checking user exists
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      // Mock update query
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock getting updated user
      db.query.mockResolvedValueOnce([[{
        id: 1,
        username: 'updateduser',
        full_name: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 1,
        role_id: 2, // default role
        is_active: 1
      }]]);

      const result = await userService.updateUser(1, userData);

      expect(result.role_id).toBe(2); // default role
    });

    it('should throw error when user not found', async () => {
      const userData = {
        username: 'updateduser',
        fullName: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 1,
        role: 'admin'
      };
      
      // Mock user not found
      db.query.mockResolvedValueOnce([[]]);

      await expect(userService.updateUser(999, userData)).rejects.toMatchObject({
        status: 404,
        message: 'User not found'
      });
    });

    it('should throw error for missing required fields', async () => {
      const userData = {
        username: 'updateduser'
        // Missing required fields
      };

      await expect(userService.updateUser(1, userData)).rejects.toMatchObject({
        status: 400,
        message: 'Missing required fields'
      });
    });

    it('should throw error for invalid gender', async () => {
      const userData = {
        username: 'updateduser',
        fullName: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 'invalid',
        role: 'admin'
      };

      await expect(userService.updateUser(1, userData)).rejects.toMatchObject({
        status: 400,
        message: 'Invalid gender value'
      });
    });

    it('should update user with password', async () => {
      const userData = {
        username: 'updateduser',
        fullName: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 0,
        role: 'admin',
        password: 'newpassword'
      };
      
      bcrypt.hash.mockResolvedValue('hashedpassword');
      
      // Mock checking user exists
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      // Mock update query with password
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock getting updated user
      db.query.mockResolvedValueOnce([[{
        id: 1,
        username: 'updateduser',
        full_name: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 0,
        role_id: 1,
        is_active: 1
      }]]);

      const result = await userService.updateUser(1, userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(result.username).toBe('updateduser');
    });

    it('should handle database errors during update', async () => {
      const userData = {
        username: 'updateduser',
        fullName: 'Updated User',
        email: 'updated@example.com',
        phone: '0987654321',
        gender: 1,
        role: 'admin'
      };
      
      // Mock checking user exists
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      // Mock database error during update
      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(userService.updateUser(1, userData)).rejects.toMatchObject({
        status: 500,
        message: 'Failed to update user'
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Mock user exists
      db.query.mockResolvedValueOnce([[{ id: 1, username: 'testuser' }]]);
      // Mock delete result
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await userService.deleteUser(1);

      expect(db.query).toHaveBeenCalledWith('SELECT id FROM users WHERE id = ?', [1]);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw error when user not found for deletion', async () => {
      // Mock user not found
      db.query.mockResolvedValueOnce([[]]);

      await expect(userService.deleteUser(999)).rejects.toMatchObject({
        status: 404,
        message: 'User not found'
      });
    });

    it('should handle database error during deletion', async () => {
      // Mock user exists
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      // Mock delete fails
      db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      await expect(userService.deleteUser(1)).rejects.toMatchObject({
        status: 500,
        message: 'Failed to delete user (no rows affected)'
      });
    });
  });

  describe('toggleAccountStatus', () => {
    it('should toggle account status to active', async () => {
      // Mock user exists
      db.query.mockResolvedValueOnce([[{ id: 1, role_id: 2 }]]);
      // Mock update status
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock get updated user
      db.query.mockResolvedValueOnce([[{
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 0,
        role_id: 2,
        is_active: 1,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }]]);

      const result = await userService.toggleAccountStatus(1, 'active');

      expect(db.query).toHaveBeenCalledWith('UPDATE users SET is_active = ? WHERE id = ?', [1, 1]);
      expect(result.is_active).toBe(1);
    });

    it('should toggle account status to inactive', async () => {
      // Mock user exists
      db.query.mockResolvedValueOnce([[{ id: 1, role_id: 2 }]]);
      // Mock update status
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock get updated user
      db.query.mockResolvedValueOnce([[{
        id: 1,
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        gender: 0,
        role_id: 2,
        is_active: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }]]);

      const result = await userService.toggleAccountStatus(1, 'inactive');

      expect(db.query).toHaveBeenCalledWith('UPDATE users SET is_active = ? WHERE id = ?', [0, 1]);
      expect(result.is_active).toBe(0);
    });

    it('should throw error when updated user not found', async () => {
      // Mock user exists
      db.query.mockResolvedValueOnce([[{ id: 1, role_id: 2 }]]);
      // Mock update status
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      // Mock get updated user fails
      db.query.mockResolvedValueOnce([[]]);

      await expect(userService.toggleAccountStatus(1, 'active')).rejects.toMatchObject({
        status: 404,
        message: 'Failed to retrieve updated user'
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      // Mock user exists with password
      db.query.mockResolvedValueOnce([[{
        id: 1,
        password: 'oldhash'
      }]]);
      
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newhash');
      
      // Mock password update
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await userService.changePassword(1, 'oldpassword', 'newpassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpassword', 'oldhash');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(result).toEqual({ message: 'Password updated successfully' });
    });

    it('should throw error when current password is missing', async () => {
      await expect(userService.changePassword(1, '', 'newpassword')).rejects.toMatchObject({
        status: 400,
        message: 'Current password and new password are required'
      });
    });

    it('should throw error when new password is missing', async () => {
      await expect(userService.changePassword(1, 'oldpassword', '')).rejects.toMatchObject({
        status: 400,
        message: 'Current password and new password are required'
      });
    });

    it('should throw error when user not found', async () => {
      // Mock user not found
      db.query.mockResolvedValueOnce([[]]);

      await expect(userService.changePassword(999, 'oldpassword', 'newpassword')).rejects.toMatchObject({
        status: 404,
        message: 'User not found'
      });
    });

    it('should throw error when current password is incorrect', async () => {
      // Mock user exists with password
      db.query.mockResolvedValueOnce([[{
        id: 1,
        password: 'oldhash'
      }]]);
      
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.changePassword(1, 'wrongpassword', 'newpassword')).rejects.toMatchObject({
        status: 401,
        message: 'Current password is incorrect'
      });
    });

    it('should handle database error during password update', async () => {
      // Mock user exists with password
      db.query.mockResolvedValueOnce([[{
        id: 1,
        password: 'oldhash'
      }]]);
      
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('newhash');
      
      // Mock password update fails
      db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      await expect(userService.changePassword(1, 'oldpassword', 'newpassword')).rejects.toMatchObject({
        status: 500,
        message: 'Failed to update password'
      });
    });
  });
});
