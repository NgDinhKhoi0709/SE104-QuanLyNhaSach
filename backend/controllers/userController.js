const userService = require('../services/userService');

/**
 * Controller để lấy tất cả người dùng
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Controller để lấy thông tin người dùng theo ID
 */
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await userService.getUserById(id);
        console.log("User data being returned to frontend:", userData);
        res.json(userData);
    } catch (err) {
        console.error('Error fetching user:', err);
        const statusCode = err.status || 500;
        const message = err.message || 'Failed to fetch user';
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Controller để thêm người dùng mới
 */
exports.addUser = async (req, res) => {
    try {
        const result = await userService.addUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error adding user:', err);
        const statusCode = err.status || 500;
        const message = err.message || 'Không thể thêm tài khoản';
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Controller để cập nhật thông tin người dùng
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.updateUser(id, req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error in updateUser:', err);
        const statusCode = err.status || 500;
        const message = err.message || 'Server error in user update';
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Controller để xóa người dùng
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUser(id);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error deleting user:', err);
        const statusCode = err.status || 500;
        const message = err.message || 'Failed to delete user';
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Controller để thay đổi trạng thái tài khoản
 */
exports.toggleAccountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expect 'active' or 'inactive'
        const result = await userService.toggleAccountStatus(id, status);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error toggling account status:', err);
        const statusCode = err.status || 500;
        const message = err.message || 'Failed to toggle account status';
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Controller để thay đổi mật khẩu
 */
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        
        const result = await userService.changePassword(id, currentPassword, newPassword);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error changing password:', err);
        const statusCode = err.status || 500;
        const message = err.message || 'Server error when changing password';
        res.status(statusCode).json({ error: message });
    }
};
