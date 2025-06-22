const authService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Kiểm tra input đầu vào
        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' });
        }
        
        const result = await authService.authenticateUser(username, password);

        res.status(200).json({
            message: 'Đăng nhập thành công',
            user: result.user,
            token: result.token
        });    } catch (error) {
        const statusCode = error.message.includes('Vui lòng cung cấp') ? 400 : 401;
        
        res.status(statusCode).json({ message: error.message });
    }
};

// Thêm endpoint để xác thực token 
exports.validateToken = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userModel = require('../models/userModel');
        const user = await userModel.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
        }
        
        // Kiểm tra tài khoản có bị khóa không
        if (user.is_active === 0) {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
        }
        
        res.status(200).json({
            message: 'Token hợp lệ',
            user
        });} catch (error) {
        res.status(500).json({ message: 'Lỗi xác thực token: ' + error.message });
    }
};

// Endpoint đăng xuất
exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Đăng xuất thành công' });    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng xuất: ' + error.message });
    }
};